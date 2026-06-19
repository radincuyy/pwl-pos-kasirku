const app = require('./app');
const {
  closeDatabaseConnection,
  testDatabaseConnection
} = require('./config/database');
const { environment, validateProductionEnvironment } = require('./config/environment');
const { connectRedis, disconnectRedis } = require('./config/redis');

async function startServer() {
  validateProductionEnvironment();
  await testDatabaseConnection();
  void connectRedis();

  const server = app.listen(environment.port, environment.host, () => {
    console.log('KasirKu API started', {
      environment: environment.nodeEnv,
      host: environment.host,
      port: environment.port
    });
  });

  let shuttingDown = false;

  async function shutdown(signal) {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    console.log('KasirKu API shutting down', { signal });

    const forceShutdownTimer = setTimeout(() => {
      console.error('KasirKu API forced shutdown after timeout', { signal });
      process.exit(1);
    }, environment.shutdownTimeoutMs);
    forceShutdownTimer.unref();

    server.close(async (serverError) => {
      const cleanupResults = await Promise.allSettled([
        disconnectRedis(),
        closeDatabaseConnection()
      ]);
      clearTimeout(forceShutdownTimer);

      const cleanupFailed = cleanupResults.some(
        (result) => result.status === 'rejected'
      );

      if (serverError || cleanupFailed) {
        console.error('KasirKu API shutdown failed', {
          signal,
          serverError: serverError?.message || null,
          cleanupFailed
        });
        process.exit(1);
      }

      console.log('KasirKu API shutdown complete', { signal });
      process.exit(0);
    });
  }

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
  process.once('SIGINT', () => {
    void shutdown('SIGINT');
  });
}

startServer().catch((error) => {
  console.error('Failed to start KasirKu API', {
    message: error.message
  });
  process.exit(1);
});
