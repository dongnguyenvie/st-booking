// Typed configuration factory — all env vars in one place
// APP_ENV controls app-level behavior (local/development/staging/production)
// NODE_ENV controls Node.js runtime behavior (development/production/test)
// Use APP_ENV when you want to run with prod Node.js optimizations but dev/staging services
const appEnv = process.env.APP_ENV || process.env.NODE_ENV || 'development';

export const configuration = () => ({
  port: parseInt(process.env.PORT || '3001', 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  appEnv,
  clientBaseUrl: process.env.ORIGIN_DOMAIN || 'http://localhost:3000',
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10) || 0,
    queueDb: parseInt(process.env.REDIS_QUEUE_DB || '2', 10) || 2,
  },
  jwt: {
    // RS256: private key for signing, public key for verification (base64-encoded PEM)
    privateKey: Buffer.from(process.env.JWT_PRIVATE_KEY || '', 'base64').toString('utf8'),
    publicKey: Buffer.from(process.env.JWT_PUBLIC_KEY || '', 'base64').toString('utf8'),
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400', 10) || 86400,
  },
  graphql: {
    playground: appEnv !== 'production',
    introspection: appEnv !== 'production',
    debug: appEnv === 'development' || appEnv === 'local',
  },
  auth0: {
    domain: process.env.AUTH0_DOMAIN || '',
    audience: process.env.AUTH0_AUDIENCE || '',
    management: {
      clientId: process.env.AUTH0_M2M_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET || '',
    },
  },
  encryption: {
    // AES-256-GCM key: base64-encoded 32 bytes. Generate: openssl rand -base64 32
    key: process.env.APP_ENCRYPTION_KEY || '',
  },
  storage: {
    // S3-compatible object storage. Endpoint only for non-AWS providers
    // (MinIO, R2…); path-style is forced when an endpoint is set.
    endpoint: process.env.S3_ENDPOINT || undefined,
    region: process.env.S3_REGION || 'us-east-1',
    bucket: process.env.S3_BUCKET || '',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true' || undefined,
    presignTtlS: parseInt(process.env.S3_PRESIGN_TTL_S || '900', 10),
  },
  env: {
    isProduction: appEnv === 'production',
    isDevelopment: appEnv !== 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
});

export type IAppConfig = ReturnType<typeof configuration>;
