import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: config.get<string>('WEB_ORIGIN'),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const openApiConfig = new DocumentBuilder()
    .setTitle('PresenCA API')
    .setDescription('API do sistema de gestão de presença Cristo Alegria.')
    .setVersion('1.0')
    .addCookieAuth('presenca_session')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, openApiConfig));

  const port = Number(config.get('API_PORT', 4000));
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
