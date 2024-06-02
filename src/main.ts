import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import type { ConfigKeyPaths } from './config';

import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { fastifyApp } from './common/adapters/fastify.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
  );

  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const { port, name } = configService.get('app', { infer: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
    }),
  );

  const logger = new Logger(name);

  try {
    await app.listen(port, '0.0.0.0');
    const url = await app.getUrl();
    logger.log(`Server is running on ${url}`);
  } catch (e: any) {
    logger.error(e);
    process.exit(1);
  }
}
bootstrap();
