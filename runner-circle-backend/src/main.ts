import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { UPLOADS_DIR } from './uploads/uploads.util';

async function bootstrap() {
  // Garante a pasta de uploads (o ServeStaticModule serve a partir dela).
  const uploadsPath = join(process.cwd(), UPLOADS_DIR);
  if (!existsSync(uploadsPath)) mkdirSync(uploadsPath, { recursive: true });

  const app = await NestFactory.create(AppModule);

  // CORS: libera qualquer porta de localhost/127.0.0.1 (dev) + origens de
  // produção listadas em CORS_ORIGINS. Requisições sem Origin (curl, apps
  // mobile, server-to-server) também passam.
  const extraOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const isLocalhost = (origin: string): boolean =>
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const allowed =
        !origin || isLocalhost(origin) || extraOrigins.includes(origin);
      callback(null, allowed);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Runner Circle API')
    .setDescription(
      'API do Runner Circle — rede social de treinos de corrida e caminhada.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(
    `🏃 Runner Circle API em http://localhost:${port} (docs em /docs)`,
  );
}

void bootstrap();
