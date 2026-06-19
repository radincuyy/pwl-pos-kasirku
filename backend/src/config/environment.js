require('dotenv').config();

const DEVELOPMENT_JWT_SECRET = 'change_this_local_development_secret';
const WEAK_JWT_SECRETS = new Set([
  DEVELOPMENT_JWT_SECRET,
  'replace_this_with_a_long_random_string'
]);

function readString(name, fallbackValue) {
  const value = process.env[name]?.trim();
  return value || fallbackValue;
}

function readPositiveInteger(name, fallbackValue) {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallbackValue;
  }

  const value = Number(rawValue);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} harus berupa bilangan bulat positif`);
  }

  return value;
}

function readBoolean(name, fallbackValue) {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallbackValue;
  }

  if (rawValue === 'true') {
    return true;
  }

  if (rawValue === 'false') {
    return false;
  }

  throw new Error(`${name} harus bernilai true atau false`);
}

function readTrustProxy() {
  const rawValue = process.env.TRUST_PROXY?.trim();

  if (!rawValue || rawValue === 'false' || rawValue === '0') {
    return false;
  }

  if (rawValue === 'true') {
    return true;
  }

  const numericValue = Number(rawValue);
  return Number.isInteger(numericValue) ? numericValue : rawValue;
}

function readFrontendOrigins() {
  return readString('FRONTEND_URL', 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const environment = Object.freeze({
  nodeEnv: readString('NODE_ENV', 'development'),
  host: readString('HOST', '0.0.0.0'),
  port: readPositiveInteger('PORT', 5001),
  appName: readString('APP_NAME', 'KasirKu API'),
  frontendOrigins: readFrontendOrigins(),
  trustProxy: readTrustProxy(),
  requestBodyLimit: readString('REQUEST_BODY_LIMIT', '100kb'),
  apiRateLimitWindowMs: readPositiveInteger(
    'API_RATE_LIMIT_WINDOW_MS',
    15 * 60 * 1000
  ),
  apiRateLimitMax: readPositiveInteger('API_RATE_LIMIT_MAX', 300),
  loginRateLimitWindowMs: readPositiveInteger(
    'LOGIN_RATE_LIMIT_WINDOW_MS',
    15 * 60 * 1000
  ),
  loginRateLimitMax: readPositiveInteger('LOGIN_RATE_LIMIT_MAX', 10),
  shutdownTimeoutMs: readPositiveInteger('SHUTDOWN_TIMEOUT_MS', 10000),
  database: Object.freeze({
    host: readString('DB_HOST', 'localhost'),
    port: readPositiveInteger('DB_PORT', 3306),
    name: readString('DB_NAME', 'pwl_pos'),
    user: readString('DB_USER', 'root'),
    password: process.env.DB_PASSWORD || '',
    connectionLimit: readPositiveInteger('DB_CONNECTION_LIMIT', 10),
    ssl: readBoolean('DB_SSL', false),
    sslRejectUnauthorized: readBoolean('DB_SSL_REJECT_UNAUTHORIZED', true),
    sslCaBase64: readString('DB_SSL_CA_BASE64', '')
  }),
  jwt: Object.freeze({
    secret: readString('JWT_SECRET', DEVELOPMENT_JWT_SECRET),
    expiresIn: readString('JWT_EXPIRES_IN', '1d')
  }),
  redis: Object.freeze({
    url: readString('REDIS_URL', ''),
    host: readString('REDIS_HOST', 'localhost'),
    port: readPositiveInteger('REDIS_PORT', 6379),
    username: readString('REDIS_USERNAME', ''),
    password: process.env.REDIS_PASSWORD || '',
    ttlSeconds: readPositiveInteger('REDIS_TTL_SECONDS', 300)
  })
});

function validateProductionEnvironment() {
  if (environment.nodeEnv !== 'production') {
    return;
  }

  const missingVariables = [
    ['FRONTEND_URL', environment.frontendOrigins.length > 0],
    ['DB_HOST', Boolean(process.env.DB_HOST)],
    ['DB_NAME', Boolean(process.env.DB_NAME)],
    ['DB_USER', Boolean(process.env.DB_USER)],
    ['DB_PASSWORD', Boolean(process.env.DB_PASSWORD)],
    ['JWT_SECRET', Boolean(process.env.JWT_SECRET)]
  ]
    .filter(([, isPresent]) => !isPresent)
    .map(([name]) => name);

  if (missingVariables.length > 0) {
    throw new Error(
      `Environment production belum lengkap: ${missingVariables.join(', ')}`
    );
  }

  if (
    environment.jwt.secret.length < 32 ||
    WEAK_JWT_SECRETS.has(environment.jwt.secret)
  ) {
    throw new Error(
      'JWT_SECRET production wajib berupa nilai acak minimal 32 karakter'
    );
  }

  for (const origin of environment.frontendOrigins) {
    let parsedOrigin;

    try {
      parsedOrigin = new URL(origin);
    } catch {
      throw new Error(`FRONTEND_URL tidak valid: ${origin}`);
    }

    if (!['http:', 'https:'].includes(parsedOrigin.protocol)) {
      throw new Error(`FRONTEND_URL harus menggunakan HTTP atau HTTPS: ${origin}`);
    }
  }
}

module.exports = {
  environment,
  validateProductionEnvironment
};
