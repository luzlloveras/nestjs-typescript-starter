import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  name: process.env.APP_NAME || 'NestJS TypeScript Starter',
  swaggerEnabled: process.env.SWAGGER_ENABLED === 'true',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));
