const { connectRedis, redisConfig } = require('../config/redis');

const cacheKeys = {
  productsList: 'products:list'
};

async function getCache(key) {
  const client = await connectRedis();
  const cachedValue = await client.get(key);

  if (!cachedValue) {
    return null;
  }

  return JSON.parse(cachedValue);
}

async function setCache(key, value, ttlSeconds) {
  const client = await connectRedis();
  const effectiveTtlSeconds = ttlSeconds || redisConfig.ttlSeconds;

  await client.set(key, JSON.stringify(value), {
    EX: effectiveTtlSeconds
  });
}

async function deleteCache(keys) {
  const client = await connectRedis();
  const normalizedKeys = Array.isArray(keys) ? keys : [keys];

  if (normalizedKeys.length === 0) {
    return;
  }

  await client.del(normalizedKeys);
}

async function clearProductsCache() {
  await deleteCache(cacheKeys.productsList);
}

module.exports = {
  cacheKeys,
  clearProductsCache,
  deleteCache,
  getCache,
  setCache
};
