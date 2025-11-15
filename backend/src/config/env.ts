import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

function requireEnv(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  DATABASE_URL: requireEnv('DATABASE_URL', 'postgres://postgres:postgres@postgres:5432/chatbot'),
  JWT_SECRET: requireEnv('JWT_SECRET', 'supersecretjwt'),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ENABLE_WHATSAPP: process.env.ENABLE_WHATSAPP === 'true',
  ENABLE_INSTAGRAM: process.env.ENABLE_INSTAGRAM === 'true',
};
