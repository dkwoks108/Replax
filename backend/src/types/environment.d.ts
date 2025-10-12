declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      MONGODB_URI: string;
      JWT_SECRET: string;
      API_URL: string;
      REDIS_URL?: string;
      CORS_ORIGIN: string;
    }
  }
}