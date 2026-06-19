const { testDatabaseConnection } = require('../config/database');
const { getRedisClient } = require('../config/redis');
const { environment } = require('../config/environment');

function getHealth(req, res) {
  return res.status(200).json({
    success: true,
    message: 'KasirKu API is running',
    data: {
      service: 'kasirku-api',
      status: 'healthy',
      environment: environment.nodeEnv,
      timestamp: new Date().toISOString()
    }
  });
}

async function getReadiness(req, res) {
  try {
    await testDatabaseConnection();
  } catch {
    return res.status(503).json({
      success: false,
      message: 'KasirKu API belum siap menerima request',
      data: {
        service: 'kasirku-api',
        status: 'unavailable',
        database: 'unavailable',
        timestamp: new Date().toISOString()
      }
    });
  }

  const redisClient = getRedisClient();

  return res.status(200).json({
    success: true,
    message: 'KasirKu API siap menerima request',
    data: {
      service: 'kasirku-api',
      status: 'ready',
      database: 'ready',
      redis: redisClient.isReady ? 'ready' : 'optional-unavailable',
      timestamp: new Date().toISOString()
    }
  });
}

module.exports = {
  getHealth,
  getReadiness
};
