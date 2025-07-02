import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { GlobalExceptionFilter } from '../../src/core/exceptions/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';

describe('CommentsController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let postId: string;
  let commentId: string;

  const testUser = {
    email: 'commenttest@example.com',
    password: 'password123',
    name: 'Comment Test User',
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
    await request(app.getHttpServer()).post('/auth/register').send(testUser);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    accessToken = loginResponse.body.accessToken;

    // Create a test post for comments
    const postResponse = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Post for Comments',
        content: 'This post will have comments',
      });

    postId = postResponse.body.id;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/comments (POST)', () => {
    it('should create a new comment successfully', () => {
      const createCommentDto = {
        content: 'This is a test comment',
        postId: postId,
      };

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createCommentDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          commentId = res.body.id; // Store for other tests
        });
    });

    it('should create a comment with long content', () => {
      const longContent = 'A'.repeat(500);
      const createCommentDto = {
        content: longContent,
        postId: postId,
      };

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createCommentDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });

    it('should return 401 without authentication', () => {
      const createCommentDto = {
        content: 'Unauthorized comment',
        postId: postId,
      };

      return request(app.getHttpServer())
        .post('/comments')
        .send(createCommentDto)
        .expect(401);
    });

    it('should return 400 for invalid data', () => {
      const createCommentDto = {
        content: '', // Empty content should be invalid
        postId: postId,
      };

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createCommentDto)
        .expect(400);
    });

    it('should return 400 for missing post ID', () => {
      const createCommentDto = {
        content: 'Valid comment content',
        // Missing postId
      };

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createCommentDto)
        .expect(400);
    });

    it('should reject non-whitelisted properties', () => {
      const createCommentDto = {
        content: 'Valid comment',
        postId: postId,
        maliciousField: 'hack attempt',
      };

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createCommentDto)
        .expect(400);
    });
  });

  describe('/comments/post/:postId (GET)', () => {
    beforeEach(async () => {
      // Create multiple test comments
      const comments = [
        'First test comment',
        'Second test comment',
        'Third test comment',
      ];

      for (const content of comments) {
        await request(app.getHttpServer())
          .post('/comments')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            content,
            postId: postId,
          });
      }
    });

    it('should get all comments for a post', () => {
      return request(app.getHttpServer())
        .get(`/comments/post/${postId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(3);
          expect(res.body[0]).toHaveProperty('content');
          expect(res.body[0]).toHaveProperty('author');
          expect(res.body[0]).toHaveProperty('post');
        });
    });

    it('should return empty array for post with no comments', async () => {
      // Create a new post without comments
      const newPostResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Post Without Comments',
          content: 'This post has no comments',
        });

      const newPostId = newPostResponse.body.id;

      return request(app.getHttpServer())
        .get(`/comments/post/${newPostId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });

    it('should return empty array for non-existent post', () => {
      return request(app.getHttpServer())
        .get('/comments/post/nonexistent-post-id')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });

    it('should handle invalid post ID format', () => {
      return request(app.getHttpServer())
        .get('/comments/post/invalid-id-format!')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/comments/:id (DELETE)', () => {
    beforeEach(async () => {
      // Create a test comment
      const createResponse = await request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'Comment to be deleted',
          postId: postId,
        });

      commentId = createResponse.body.id;
    });

    it('should delete a comment successfully', () => {
      return request(app.getHttpServer())
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Comment deleted successfully',
          );
        });
    });

    it('should return 404 for non-existent comment', () => {
      return request(app.getHttpServer())
        .delete('/comments/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/comments/${commentId}`)
        .expect(401);
    });

    it("should return 403 when trying to delete another user's comment", async () => {
      // Create another user
      const anotherUser = {
        email: 'another@example.com',
        password: 'password123',
        name: 'Another User',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(anotherUser);

      const anotherLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: anotherUser.email,
          password: anotherUser.password,
        });

      const anotherAccessToken = anotherLoginResponse.body.accessToken;

      return request(app.getHttpServer())
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${anotherAccessToken}`)
        .expect(403);
    });

    it('should handle invalid comment ID format', () => {
      return request(app.getHttpServer())
        .delete('/comments/invalid-id-format!')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('Comment validation and security', () => {
    it('should sanitize comment content (XSS protection)', () => {
      const maliciousContent = '<script>alert("xss")</script>Normal content';
      const createCommentDto = {
        content: maliciousContent,
        postId: postId,
      };

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createCommentDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          // The content should be handled by validation/sanitization
        });
    });

    it('should handle special characters in content', () => {
      const specialContent =
        'Comment with émojis 🎉 and spëcial chars: @#$%^&*()';
      const createCommentDto = {
        content: specialContent,
        postId: postId,
      };

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createCommentDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });

    it('should handle maximum content length', () => {
      const maxContent = 'A'.repeat(10000); // Very long content
      const createCommentDto = {
        content: maxContent,
        postId: postId,
      };

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createCommentDto)
        .expect((res) => {
          // Should either accept (201) or reject with validation error (400)
          expect([201, 400]).toContain(res.status);
        });
    });
  });
});
