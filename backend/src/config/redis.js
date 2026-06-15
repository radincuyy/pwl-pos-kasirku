const { createClient } = require('redis');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  ttlSeconds: Number(process.env.REDIS_TTL_SECONDS || 300)
};

let redisClient = null;
let connectingPromise = null;

function createRedisClient() {
  const client = createClient({
    socket: {
      host: redisConfig.host,
      port: redisConfig.port
    },
    password: redisConfig.password
  });

  client.on('error', (error) => {
    console.error('Redis client error', {
      message: error.message
    });
  });

  return client;
}

function getRedisClient() {
  if (!redisClient) {
    redisClient = createRedisClient();
  }

  return redisClient;
}

async function connectRedis() {
  const client = getRedisClient();

  if (client.isOpen) {
    return client;
  }

  if (!connectingPromise) {
    connectingPromise = client.connect().finally(() => {
      connectingPromise = null;
    });
  }

  await connectingPromise;

  return client;
}

async function disconnectRedis() {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
}

module.exports = {
  redisConfig,
  getRedisClient,
  connectRedis,
  disconnectRedis
};
