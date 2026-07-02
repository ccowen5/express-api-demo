import { config } from 'dotenv';

config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  db: {
    host: required('DB_HOST'),
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    name: required('DB_NAME'),
  },
};
