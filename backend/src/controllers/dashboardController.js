const { pool } = require('../config/database');

async function getDashboardSummary(req, res) {
  const [[productCount], [transactionCount], [revenueTotal], [lowStockCount]] = await Promise.all([
    pool.query('SELECT COUNT(*) AS count FROM products'),
    pool.query('SELECT COUNT(*) AS count FROM sales'),
    pool.query('SELECT COALESCE(SUM(total_amount), 0) AS total FROM sales'),
    pool.query('SELECT COUNT(*) AS count FROM products WHERE stock <= minimum_stock'),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Dashboard summary berhasil diambil',
    data: {
      totalProducts: Number(productCount[0].count),
      totalTransactions: Number(transactionCount[0].count),
      totalRevenue: Number(revenueTotal[0].total),
      lowStockProducts: Number(lowStockCount[0].count),
    },
  });
}

module.exports = {
  getDashboardSummary,
};
