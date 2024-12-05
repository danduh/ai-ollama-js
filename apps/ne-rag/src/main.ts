/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import * as console from 'node:console';

async function bootstrap(){
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.enableCors({
    origin: '*',  // Allow requests from any origin
  });

  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  const configService = app.get(ConfigService);
  console.log(configService.get('RAG_SOURCE_FOLDER'));
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
