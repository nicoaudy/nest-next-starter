import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';

(async () => {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.PORT || 3333);
  Logger.log(`SERVER IS RUNNING ON PORT: ${process.env.PORT || 3333}`);
})();
