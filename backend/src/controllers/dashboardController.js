const { pool } = require('../config/database');
const { cacheKeys, getCache, setCache } = require('../utils/cache');

// Tambah cache key baru untuk dashboard
cacheKeys.dashboardSummary = 'dashboard:summary';

async function getSummary(req, res) {
  const cachedSummary = await getCache(cacheKeys.dashboardSummary);

  if (cachedSummary) {
    return res.status(200).json({
      success: true,
      message: 'Data dashboard berhasil diambil',
      data: { summary: cachedSummary }
    });
  }

  const [[productCount]] = await pool.execute(
    'SELECT COUNT(*) AS total FROM products'
  );

  const [[salesCount]] = await pool.execute(
    'SELECT COUNT(*) AS total FROM sales WHERE status = ?',
    ['paid']
  );

  const [[revenueToday]] = await pool.execute(
    `SELECT COALESCE(SUM(total_amount), 0) AS total
     FROM sales
     WHERE status = 'paid' AND DATE(sale_date) = CURDATE()`
  );

  const [lowStockProducts] = await pool.execute(
    `SELECT products.id, products.sku, products.name, products.stock, products.minimum_stock,
            categories.name AS category_name
     FROM products
     INNER JOIN categories ON categories.id = products.category_id
     WHERE products.stock <= products.minimum_stock
     ORDER BY products.stock ASC
     LIMIT 10`
  );

  const [recentSales] = await pool.execute(
    `SELECT sales.id, sales.invoice_number, users.name AS cashier_name,
            customers.name AS customer_name, sales.total_amount,
            sales.payment_method, sales.status, sales.sale_date
     FROM sales
     INNER JOIN users ON users.id = sales.user_id
     LEFT JOIN customers ON customers.id = sales.customer_id
     ORDER BY sales.id DESC
     LIMIT 5`
  );

  const summary = {
    totalProducts: Number(productCount.total),
    totalSales: Number(salesCount.total),
    revenueToday: Number(revenueToday.total),
    lowStockProducts: lowStockProducts.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      stock: Number(p.stock),
      minimumStock: Number(p.minimum_stock),
      categoryName: p.category_name
    })),
    recentSales: recentSales.map((s) => ({
      id: s.id,
      invoiceNumber: s.invoice_number,
      cashierName: s.cashier_name,
      customerName: s.customer_name,
      totalAmount: Number(s.total_amount),
      paymentMethod: s.payment_method,
      status: s.status,
      saleDate: s.sale_date
    }))
  };

  await setCache(cacheKeys.dashboardSummary, summary, 60);

  return res.status(200).json({
    success: true,
    message: 'Data dashboard berhasil diambil',
    data: { summary }
  });
}

module.exports = { getSummary };
