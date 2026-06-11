function notFoundMiddleware(req, res) {
  return res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
}

module.exports = notFoundMiddleware;
