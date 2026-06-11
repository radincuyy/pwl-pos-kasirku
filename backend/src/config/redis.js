const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  ttlSeconds: Number(process.env.REDIS_TTL_SECONDS || 300)
};

module.exports = redisConfig;
