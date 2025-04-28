import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZATION === 'true',
  },
  authorization: {
    jwt: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION
      ? parseInt(process.env.JWT_EXPIRATION, 10)
      : 3600,
  },
  paths: {
    image: 'public/uploads/',
    default: 'public/no-img',
  },
}));
