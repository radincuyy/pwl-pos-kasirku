const app = require('./app');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 5001;

async function startServer() {
  connectRedis().catch((error) => {
    void error;
  });

  app.listen(PORT, () => {
    console.log(`KasirKu API running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start KasirKu API', {
    message: error.message
  });
  process.exit(1);
});
