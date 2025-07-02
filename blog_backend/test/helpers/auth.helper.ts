import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestConfig } from '../test.config';

export class AuthTestHelper {
  static async registerAndLogin(
    app: INestApplication,
    userSuffix = '',
  ): Promise<{ accessToken: string; userId: string; user: any }> {
    const testUser = TestConfig.getTestUser(userSuffix);

    // Register user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    const userId = registerResponse.body.id;

    // Login user
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    const accessToken = loginResponse.body.accessToken;

    return {
      accessToken,
      userId,
      user: testUser,
    };
  }

  static async createMultipleUsers(
    app: INestApplication,
    count: number,
  ): Promise<Array<{ accessToken: string; userId: string; user: any }>> {
    const users = [];

    for (let i = 0; i < count; i++) {
      const userData = await this.registerAndLogin(app, i.toString());
      users.push(userData);
    }

    return users;
  }

  static async loginWithCredentials(
    app: INestApplication,
    email: string,
    password: string,
  ): Promise<string> {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    return loginResponse.body.accessToken;
  }

  static getAuthHeaders(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  static async validateTokenExpiry(
    app: INestApplication,
    accessToken: string,
  ): Promise<boolean> {
    try {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      return true;
    } catch {
      return false;
    }
  }
}
