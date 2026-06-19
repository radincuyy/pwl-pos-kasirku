const mysql = require('mysql2/promise');

const { environment } = require('./environment');

const databaseConfig = {
  host: environment.database.host,
  port: environment.database.port,
  database: environment.database.name,
  user: environment.database.user,
  password: environment.database.password,
  waitForConnections: true,
  connectionLimit: environment.database.connectionLimit,
  queueLimit: 0,
  ...(environment.database.ssl && {
    ssl: {
      rejectUnauthorized: environment.database.sslRejectUnauthorized,
      ...(environment.database.sslCaBase64 && {
        ca: Buffer.from(
          environment.database.sslCaBase64,
          'base64'
        ).toString('utf8')
      })
    }
  })
};

const pool = mysql.createPool(databaseConfig);

async function testDatabaseConnection() {
  const connection = await pool.getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

async function closeDatabaseConnection() {
  await pool.end();
}

module.exports = {
  closeDatabaseConnection,
  databaseConfig,
  pool,
  testDatabaseConnection
};
