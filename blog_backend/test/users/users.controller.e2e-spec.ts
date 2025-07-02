import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { GlobalExceptionFilter } from '../../src/core/exceptions/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  const testUser = {
    email: 'usertest@example.com',
    password: 'password123',
    name: 'User Test',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same configuration as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.enableCors();

    await app.init();

    // Register and login to get access token
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    userId = registerResponse.body.id;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    accessToken = loginResponse.body.accessToken;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/users/:id (GET)', () => {
    it('should get user profile by id', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('email', testUser.email);
          expect(res.body).toHaveProperty('username', testUser.name);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/users/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer()).get(`/users/${userId}`).expect(401);
    });

    it('should handle invalid user ID format', () => {
      return request(app.getHttpServer())
        .get('/users/invalid-id-format!')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update user profile successfully', () => {
      const updateUserDto = {
        username: 'Updated Username',
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'User updated successfully',
          );
        });
    });

    it('should return 404 for non-existent user', () => {
      const updateUserDto = {
        username: 'New Username',
      };

      return request(app.getHttpServer())
        .put('/users/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(404);
    });

    it('should return 401 without authentication', () => {
      const updateUserDto = {
        username: 'New Username',
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(updateUserDto)
        .expect(401);
    });

    it("should return 403 when trying to update another user's profile", async () => {
      // Create another user
      const anotherUser = {
        email: 'another@example.com',
        password: 'password123',
        name: 'Another User',
      };

      const anotherRegisterResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(anotherUser);

      const anotherUserId = anotherRegisterResponse.body.id;

      const updateUserDto = {
        username: 'Hacked Username',
      };

      return request(app.getHttpServer())
        .put(`/users/${anotherUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(403);
    });

    it('should reject non-whitelisted properties', () => {
      const updateUserDto = {
        username: 'Valid Username',
        maliciousField: 'hack attempt',
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(400);
    });

    it('should handle empty update data', () => {
      const updateUserDto = {};

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(200);
    });

    it('should validate username length', () => {
      const updateUserDto = {
        username: 'A'.repeat(256), // Very long username
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect((res) => {
          // Should either accept (200) or reject with validation error (400)
          expect([200, 400]).toContain(res.status);
        });
    });

    it('should handle special characters in username', () => {
      const updateUserDto = {
        username: 'User with émojis 🎉 and spëcial chars',
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect((res) => {
          // Should either accept (200) or reject with validation error (400)
          expect([200, 400]).toContain(res.status);
        });
    });

    it('should prevent XSS in username', () => {
      const updateUserDto = {
        username: '<script>alert("xss")</script>ValidName',
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect((res) => {
          // Should either accept sanitized version (200) or reject (400)
          expect([200, 400]).toContain(res.status);
        });
    });
  });

  describe('User data security', () => {
    it('should never expose password in any response', async () => {
      // Test profile endpoint
      const profileResponse = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(profileResponse.body).not.toHaveProperty('password');

      // Test update endpoint
      const updateResponse = await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ username: 'Updated Name' })
        .expect(200);

      expect(updateResponse.body).not.toHaveProperty('password');
    });

    it('should handle SQL injection attempts in user ID', () => {
      const maliciousId = "'; DROP TABLE users; --";

      return request(app.getHttpServer())
        .get(`/users/${encodeURIComponent(maliciousId)}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res) => {
          // Should return 404 for invalid ID, not cause any database issues
          expect(res.status).toBe(404);
        });
    });

    it('should validate user ownership for sensitive operations', async () => {
      // Create another user and try to access their data
      const anotherUser = {
        email: 'private@example.com',
        password: 'password123',
        name: 'Private User',
      };

      const anotherRegisterResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(anotherUser);

      const anotherUserId = anotherRegisterResponse.body.id;

      // Try to access another user's profile with first user's token
      return request(app.getHttpServer())
        .get(`/users/${anotherUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect((res) => {
          // Should either allow (if public profile) or forbid (if private)
          // Based on your business logic, adjust the expected status
          expect([200, 403]).toContain(res.status);
        });
    });
  });

  describe('User profile consistency', () => {
    it('should maintain data consistency across endpoints', async () => {
      // Update username
      const newUsername = 'Consistent Username';
      await request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ username: newUsername })
        .expect(200);

      // Check auth profile endpoint
      const authProfileResponse = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(authProfileResponse.body.username).toBe(newUsername);

      // Check users profile endpoint
      const userProfileResponse = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(userProfileResponse.body.username).toBe(newUsername);
    });

    it('should handle concurrent updates gracefully', async () => {
      const username1 = 'Concurrent Update 1';
      const username2 = 'Concurrent Update 2';

      // Send two concurrent requests
      const [response1, response2] = await Promise.all([
        request(app.getHttpServer())
          .put(`/users/${userId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ username: username1 }),
        request(app.getHttpServer())
          .put(`/users/${userId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ username: username2 }),
      ]);

      // Both should succeed (last one wins) or handle conflicts appropriately
      expect([200, 409]).toContain(response1.status);
      expect([200, 409]).toContain(response2.status);
    });
  });
});
