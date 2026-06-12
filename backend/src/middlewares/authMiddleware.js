const createHttpError = require('../utils/createHttpError');
const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Token akses wajib dikirim'));
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return next(createHttpError(401, 'Token akses tidak valid atau kedaluwarsa'));
  }
}

module.exports = authMiddleware;
