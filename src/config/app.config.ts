import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  swaggerEnabled: process.env.SWAGGER_ENABLED === 'true',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));
