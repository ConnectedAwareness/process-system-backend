require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerConfiguration } from './app.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  SwaggerConfiguration.configure(app);

  await app.listen(3000);
}
bootstrap();
