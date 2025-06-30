import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['123456789asdfghjkl']
  }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true // security feature to exclude data that is not expected in requests. Example properties in dtos that are not defined.
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
