const jwt = require('jsonwebtoken');

const { environment } = require('../config/environment');

function signToken(payload) {
  return jwt.sign(payload, environment.jwt.secret, {
    expiresIn: environment.jwt.expiresIn
  });
}

function verifyToken(token) {
  return jwt.verify(token, environment.jwt.secret);
}

module.exports = {
  signToken,
  verifyToken
};
