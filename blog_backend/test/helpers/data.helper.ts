import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestConfig } from '../test.config';

export class DataTestHelper {
  static async createTestPost(
    app: INestApplication,
    accessToken: string,
    postData?: Partial<any>,
  ): Promise<{ postId: string; postData: any }> {
    const defaultPostData = TestConfig.getTestPost('test-author-id');
    const finalPostData = { ...defaultPostData, ...postData };

    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(finalPostData)
      .expect(201);

    return {
      postId: response.body.id,
      postData: finalPostData,
    };
  }

  static async createTestComment(
    app: INestApplication,
    accessToken: string,
    postId: string,
    commentData?: Partial<any>,
  ): Promise<{ commentId: string; commentData: any }> {
    const defaultCommentData = TestConfig.getTestComment(postId);
    const finalCommentData = { ...defaultCommentData, ...commentData };

    const response = await request(app.getHttpServer())
      .post('/comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(finalCommentData)
      .expect(201);

    return {
      commentId: response.body.id,
      commentData: finalCommentData,
    };
  }

  static async createMultiplePosts(
    app: INestApplication,
    accessToken: string,
    count: number,
  ): Promise<string[]> {
    const postIds = [];

    for (let i = 0; i < count; i++) {
      const { postId } = await this.createTestPost(app, accessToken, {
        title: `Test Post ${i + 1}`,
        content: `This is test post number ${i + 1} content.`,
      });
      postIds.push(postId);
    }

    return postIds;
  }

  static async createMultipleComments(
    app: INestApplication,
    accessToken: string,
    postId: string,
    count: number,
  ): Promise<string[]> {
    const commentIds = [];

    for (let i = 0; i < count; i++) {
      const { commentId } = await this.createTestComment(
        app,
        accessToken,
        postId,
        {
          content: `This is test comment number ${i + 1}.`,
        },
      );
      commentIds.push(commentId);
    }

    return commentIds;
  }

  static generateLargeContent(size: number): string {
    return 'A'.repeat(size);
  }

  static generateRandomString(length: number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static getTestDataVariations() {
    return {
      titles: [
        'Short Title',
        'This is a Medium Length Title for Testing',
        'This is a Very Long Title That Should Test the Maximum Length Limitations and Ensure Proper Handling of Extended Content',
        'Title with Numbers 123 and Symbols !@#$%',
        'Título con Caracteres Especiales áéíóú ñ',
        'Title with Émojis 🎉🚀💻',
      ],
      contents: [
        'Short content.',
        'This is a medium length content that provides more context for testing purposes and should cover most normal use cases.',
        "This is a very long content that tests the system's ability to handle large amounts of text. ".repeat(
          50,
        ),
        'Content with special characters: !@#$%^&*()_+-=[]{}|;:,.<>?',
        'Contenido en español con caracteres especiales: áéíóúñ ¿¡',
        'Content with emojis: 🎉 🚀 💻 📝 ✨ 🌟',
      ],
      emails: [
        'test@example.com',
        'user.name@domain.co.uk',
        'test+tag@example.org',
        'very.long.email.address@very.long.domain.name.com',
      ],
    };
  }
}
