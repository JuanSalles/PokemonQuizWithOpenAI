import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.enableCors({
    origin: 'https://quizdev.vercel.app', // substitua por seu domínio
  });
}
bootstrap();
