import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';
import packageJson from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.enableCors({
    origin: configService.get('app.corsOrigin'),
    credentials: true,
  });

  app.setGlobalPrefix('api', {
    exclude: [
      { path: '', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
      { path: 'openapi.json', method: RequestMethod.GET },
      { path: 'redoc', method: RequestMethod.GET },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  if (configService.get('app.swaggerEnabled')) {
    const config = new DocumentBuilder()
      .setTitle('NestJS Starter API')
      .setDescription('Minimal API starter with products and system endpoints.')
      .setVersion(packageJson.version)
      .addTag('Products', 'Products resource')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    app.getHttpAdapter().get('/openapi.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(document);
    });
    app.getHttpAdapter().get('/redoc', (_req, res) => {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${packageJson.name} API Reference</title>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url="/openapi.json"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>`);
    });
  }

  const port = configService.get('app.port');
  await app.listen(port);
  console.log(`Running on http://localhost:${port}`);
}
bootstrap();
