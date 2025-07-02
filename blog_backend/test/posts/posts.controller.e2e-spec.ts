import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { GlobalExceptionFilter } from '../../src/core/exceptions/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let postId: string;

  const testUser = {
    email: 'posttest@example.com',
    password: 'password123',
    name: 'Post Test User',
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
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/posts (POST)', () => {
    it('should create a new post successfully', () => {
      const createPostDto = {
        title: 'Test Post',
        content: 'This is a test post content',
        imageUrl: 'https://example.com/image.jpg',
        imagePublicId: 'image-public-id',
      };

      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          postId = res.body.id; // Store for other tests
        });
    });

    it('should create a post without image', () => {
      const createPostDto = {
        title: 'Post Without Image',
        content: 'This post has no image',
      };

      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });

    it('should return 401 without authentication', () => {
      const createPostDto = {
        title: 'Unauthorized Post',
        content: 'This should not be created',
      };

      return request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(401);
    });

    it('should return 400 for invalid data', () => {
      const createPostDto = {
        title: '', // Empty title should be invalid
        content: 'Valid content',
      };

      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDto)
        .expect(400);
    });

    it('should reject non-whitelisted properties', () => {
      const createPostDto = {
        title: 'Valid Title',
        content: 'Valid content',
        maliciousField: 'hack attempt',
      };

      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDto)
        .expect(400);
    });
  });

  describe('/posts (GET)', () => {
    beforeEach(async () => {
      // Create a test post
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Post for GET',
          content: 'Content for GET test',
        });

      postId = createResponse.body.id;
    });

    it('should get all posts', () => {
      return request(app.getHttpServer())
        .get('/posts')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should get posts by author', () => {
      return request(app.getHttpServer())
        .get('/posts?authorId=some-user-id')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/posts/:id (GET)', () => {
    beforeEach(async () => {
      // Create a test post
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Post for GET by ID',
          content: 'Content for GET by ID test',
        });

      postId = createResponse.body.id;
    });

    it('should get a post by id', () => {
      return request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', postId);
          expect(res.body).toHaveProperty('title', 'Test Post for GET by ID');
          expect(res.body).toHaveProperty(
            'content',
            'Content for GET by ID test',
          );
        });
    });

    it('should return 404 for non-existent post', () => {
      return request(app.getHttpServer())
        .get('/posts/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer()).get(`/posts/${postId}`).expect(401);
    });
  });

  describe('/posts/:id (PUT)', () => {
    beforeEach(async () => {
      // Create a test post
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Post for UPDATE',
          content: 'Content for UPDATE test',
        });

      postId = createResponse.body.id;
    });

    it('should update a post successfully', () => {
      const updatePostDto = {
        title: 'Updated Post Title',
        content: 'Updated post content',
        imageUrl: 'https://example.com/updated-image.jpg',
      };

      return request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePostDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Post updated successfully',
          );
        });
    });

    it('should return 404 for non-existent post', () => {
      const updatePostDto = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      return request(app.getHttpServer())
        .put('/posts/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePostDto)
        .expect(404);
    });

    it('should return 401 without authentication', () => {
      const updatePostDto = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      return request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .send(updatePostDto)
        .expect(401);
    });

    it('should return 400 for invalid data', () => {
      const updatePostDto = {
        title: '', // Empty title should be invalid
        content: 'Valid content',
      };

      return request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePostDto)
        .expect(400);
    });
  });

  describe('/posts/:id (DELETE)', () => {
    beforeEach(async () => {
      // Create a test post
      const createResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Post for DELETE',
          content: 'Content for DELETE test',
        });

      postId = createResponse.body.id;
    });

    it('should delete a post successfully', () => {
      return request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'Post deleted successfully',
          );
        });
    });

    it('should return 404 for non-existent post', () => {
      return request(app.getHttpServer())
        .delete('/posts/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .expect(401);
    });
  });
});
