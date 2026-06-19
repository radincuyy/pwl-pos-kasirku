const { getRedisClient, redisConfig } = require('../config/redis');

const cacheKeys = {
  productsList: 'products:list',
  dashboardSummary: 'dashboard:summary'
};

async function getCache(key) {
  try {
    const client = getRedisClient();
    if (!client || !client.isReady) {
      return null;
    }
    const cachedValue = await client.get(key);

    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue);
  } catch (error) {
    void error;
    return null;
  }
}

async function setCache(key, value, ttlSeconds) {
  try {
    const client = getRedisClient();
    if (!client || !client.isReady) {
      return;
    }
    const effectiveTtlSeconds = ttlSeconds || redisConfig.ttlSeconds;

    await client.set(key, JSON.stringify(value), {
      EX: effectiveTtlSeconds
    });
  } catch (error) {
    void error;
  }
}

async function deleteCache(keys) {
  try {
    const client = getRedisClient();
    if (!client || !client.isReady) {
      return;
    }
    const normalizedKeys = Array.isArray(keys) ? keys : [keys];

    if (normalizedKeys.length === 0) {
      return;
    }

    await client.del(normalizedKeys);
  } catch (error) {
    void error;
  }
}

async function clearProductsCache() {
  await deleteCache(cacheKeys.productsList);
}

async function clearDashboardCache() {
  await deleteCache(cacheKeys.dashboardSummary);
}

async function clearProductDataCache() {
  await deleteCache([
    cacheKeys.productsList,
    cacheKeys.dashboardSummary
  ]);
}

module.exports = {
  cacheKeys,
  clearDashboardCache,
  clearProductDataCache,
  clearProductsCache,
  deleteCache,
  getCache,
  setCache
};
