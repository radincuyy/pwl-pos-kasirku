const { rateLimit } = require('express-rate-limit');

const { environment } = require('../config/environment');

function createRateLimitHandler(message) {
  return (req, res) => {
    return res.status(429).json({
      success: false,
      message
    });
  };
}

const apiRateLimit = rateLimit({
  windowMs: environment.apiRateLimitWindowMs,
  limit: environment.apiRateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.path === '/health/ready',
  handler: createRateLimitHandler(
    'Terlalu banyak request. Silakan coba kembali beberapa saat lagi'
  )
});

const loginRateLimit = rateLimit({
  windowMs: environment.loginRateLimitWindowMs,
  limit: environment.loginRateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: createRateLimitHandler(
    'Terlalu banyak percobaan login. Silakan coba kembali beberapa saat lagi'
  )
});

module.exports = {
  apiRateLimit,
  loginRateLimit
};
