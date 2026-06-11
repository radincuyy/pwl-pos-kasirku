const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'pwl_pos',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
};

module.exports = databaseConfig;
