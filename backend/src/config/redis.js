const { createClient } = require('redis');

const redisConfig = {
  url: process.env.REDIS_URL || '',
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
  username: process.env.REDIS_USERNAME || undefined,
  password: process.env.REDIS_PASSWORD || undefined,
  ttlSeconds: Number(process.env.REDIS_TTL_SECONDS || 300)
};

let redisClient = null;
let connectingPromise = null;
let hasLoggedError = false;

function createRedisClientOptions() {
  const reconnectSocketConfig = {
    reconnectStrategy: () => {
      return 15000;
    }
  };

  if (redisConfig.url) {
    return {
      url: redisConfig.url,
      socket: reconnectSocketConfig
    };
  }

  return {
    username: redisConfig.username,
    password: redisConfig.password,
    socket: {
      ...reconnectSocketConfig,
      host: redisConfig.host,
      port: redisConfig.port
    }
  };
}

function createRedisClient() {
  const client = createClient(createRedisClientOptions());

  client.on('error', (error) => {
    if (!hasLoggedError) {
      console.warn('Redis is offline. Application will run in fallback mode (querying MySQL database directly).', {
        message: error.message || 'Connection refused'
      });
      hasLoggedError = true;
    }
  });

  client.on('connect', () => {
    console.log('Connected to Redis successfully');
    hasLoggedError = false;
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
    connectingPromise = client.connect()
      .catch((error) => {
        if (!hasLoggedError) {
          console.warn('Redis connection failed. Continuing server startup in database-only mode.', {
            message: error.message || 'Connection refused'
          });
          hasLoggedError = true;
        }
      })
      .finally(() => {
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
