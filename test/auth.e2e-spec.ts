import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const emailValue = 'e2e@test.com';
    
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: emailValue,
        password: 'password'
      })
      .expect(201)
      .then((res) => {
        const {id, email} = res.body;
        
        expect(id).toBeDefined();
        expect(email).toEqual(emailValue)
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'test@test.com';

    const response = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email, password: 'mypassword'
      })
      .expect(201);

      const cookie = response.get('Set-Cookie');

      const {body} = await request(app.getHttpServer())
        .get('/auth/who-am-i')
        .set('Cookie', cookie as string[])
        .expect(200);

      expect(body.email).toEqual(email);
  });
});
