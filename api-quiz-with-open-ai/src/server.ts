import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as serverless from 'serverless-http';
import * as express from 'express';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.init().then(() => {
    const handler = serverless(server);
    module.exports.handler = handler;
  });
}

bootstrap();
