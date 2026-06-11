function getHealth(req, res) {
  return res.status(200).json({
    success: true,
    message: 'KasirKu API is running',
    data: {
      service: 'kasirku-api',
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
}

module.exports = {
  getHealth
};
