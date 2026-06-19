const createHttpError = require('../utils/createHttpError');

function authorizeRoles(...allowedRoles) {
  return function roleAuthorizationMiddleware(req, res, next) {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return next(createHttpError(403, 'Anda tidak memiliki izin untuk mengakses fitur ini'));
    }

    return next();
  };
}

module.exports = authorizeRoles;
