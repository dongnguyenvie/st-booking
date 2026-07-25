// Register the @prisma/client path alias at runtime so the custom Prisma v7+ output
// path (src/generated/prisma-client) is resolved correctly in production builds.
// Using the programmatic API avoids a dependency on tsconfig.json at runtime.
// import { register } from 'tsconfig-paths';
// import { join } from 'path';
// register({
//   baseUrl: join(__dirname, '..'), // resolves to apps/api/
//   paths: { '@prisma/client': ['src/generated/prisma-client'] },
// });
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const compression = require('compression');
import { AppModule } from './app.module';
import { CustomLogger } from './modules/@core/logger/custom-logger';
import { AllExceptionsFilter } from './modules/@core/filters/http-exception.filter';
import { ErrorsInterceptor } from './modules/@core/interceptors/errors.interceptor';
import { TransformResponseInterceptor } from './modules/@core/interceptors/transform-response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use custom logger
  app.useLogger(app.get(CustomLogger));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 7001;
  const clientBaseUrl = configService.get<string>('clientBaseUrl') ?? '';

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS
  const origins = clientBaseUrl
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    credentials: true,
    origin: origins.includes('*') ? '*' : origins.length ? origins : '*',
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ErrorsInterceptor(), new TransformResponseInterceptor());

  // Swagger (disabled in production)
  if (!configService.get<boolean>('env.isProduction')) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Carousel Marketplace API')
      .setDescription('Carousel Marketplace REST API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);
  }

  // GraphiQL playground served locally (dev only) — avoids Chrome HTTPS→localhost blocking
  if (!configService.get<boolean>('env.isProduction')) {
    const httpAdapter = app.getHttpAdapter();
    const endpoint = `http://localhost:${port}/graphql`;
    httpAdapter.get('/graphql-ui', (_req: any, res: any) => {
      // Remove Helmet's CSP so CDN scripts load
      res.removeHeader('Content-Security-Policy');
      res.setHeader('Content-Type', 'text/html');
      res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>GraphiQL — Carousel Marketplace API</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/graphiql@3/graphiql.min.css" />
    <style>body,html{margin:0;height:100%;overflow:hidden}#graphiql{height:100vh}</style>
  </head>
  <body>
    <div id="graphiql"></div>
    <script crossorigin src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
    <script crossorigin src="https://cdn.jsdelivr.net/npm/graphiql@3/graphiql.min.js"></script>
    <script>
      const root = ReactDOM.createRoot(document.getElementById('graphiql'));
      root.render(React.createElement(GraphiQL, {
        fetcher: GraphiQL.createFetcher({ url: '${endpoint}' }),
        defaultEditorToolsVisibility: true,
      }));
    </script>
  </body>
</html>`);
    });
    logger.log(`GraphiQL playground: http://localhost:${port}/graphql-ui`);
  }

  await app.listen(port);
  logger.log(`Server running on port ${port} [${configService.get('nodeEnv')}]`);
}

bootstrap();
