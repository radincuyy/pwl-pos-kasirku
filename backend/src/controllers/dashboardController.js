const { pool } = require('../config/database');
const { cacheKeys, getCache, setCache } = require('../utils/cache');

function toRecentSaleResponse(sale) {
  return {
    id: sale.id,
    invoiceNumber: sale.invoice_number,
    cashierName: sale.cashier_name,
    customerName: sale.customer_name,
    totalAmount: Number(sale.total_amount),
    paymentMethod: sale.payment_method,
    status: sale.status,
    saleDate: sale.sale_date
  };
}

function toSalesTrendResponse(row) {
  return {
    date: row.sale_date,
    transactionCount: Number(row.transaction_count),
    revenue: Number(row.revenue)
  };
}

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

  const [[salesToday]] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM sales
     WHERE status = 'paid' AND DATE(sale_date) = CURDATE()`
  );

  const [[revenueToday]] = await pool.execute(
    `SELECT COALESCE(SUM(total_amount), 0) AS total
     FROM sales
     WHERE status = 'paid' AND DATE(sale_date) = CURDATE()`
  );

  const [[totalRevenue]] = await pool.execute(
    `SELECT COALESCE(SUM(total_amount), 0) AS total
     FROM sales
     WHERE status = 'paid'`
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

  const [salesTrend] = await pool.execute(
    `SELECT DATE_FORMAT(sale_date, '%Y-%m-%d') AS sale_date,
            COUNT(*) AS transaction_count,
            COALESCE(SUM(total_amount), 0) AS revenue
     FROM sales
     WHERE status = 'paid'
       AND sale_date >= CURDATE() - INTERVAL 89 DAY
     GROUP BY DATE_FORMAT(sale_date, '%Y-%m-%d')
     ORDER BY DATE_FORMAT(sale_date, '%Y-%m-%d') ASC`
  );

  const summary = {
    totalProducts: Number(productCount.total),
    totalSalesToday: Number(salesToday.total),
    revenueToday: Number(revenueToday.total),
    totalRevenue: Number(totalRevenue.total),
    lowStockProducts: lowStockProducts.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      stock: Number(p.stock),
      minimumStock: Number(p.minimum_stock),
      categoryName: p.category_name
    })),
    recentSales: recentSales.map(toRecentSaleResponse),
    salesTrend: salesTrend.map(toSalesTrendResponse)
  };

  await setCache(cacheKeys.dashboardSummary, summary, 60);

  return res.status(200).json({
    success: true,
    message: 'Data dashboard berhasil diambil',
    data: { summary }
  });
}

async function getCashierSummary(req, res) {
  const [[todaySummary]] = await pool.execute(
    `SELECT COUNT(*) AS total_sales,
            COALESCE(SUM(total_amount), 0) AS revenue
     FROM sales
     WHERE user_id = ? AND status = 'paid' AND DATE(sale_date) = CURDATE()`,
    [req.user.id]
  );

  const [[itemsSoldToday]] = await pool.execute(
    `SELECT COALESCE(SUM(sale_items.quantity), 0) AS total
     FROM sale_items
     INNER JOIN sales ON sales.id = sale_items.sale_id
     WHERE sales.user_id = ? AND sales.status = 'paid'
       AND DATE(sales.sale_date) = CURDATE()`,
    [req.user.id]
  );

  const [recentSales] = await pool.execute(
    `SELECT sales.id, sales.invoice_number, users.name AS cashier_name,
            customers.name AS customer_name, sales.total_amount,
            sales.payment_method, sales.status, sales.sale_date
     FROM sales
     INNER JOIN users ON users.id = sales.user_id
     LEFT JOIN customers ON customers.id = sales.customer_id
     WHERE sales.user_id = ?
     ORDER BY sales.id DESC
     LIMIT 5`,
    [req.user.id]
  );

  const [salesTrend] = await pool.execute(
    `SELECT DATE_FORMAT(sale_date, '%Y-%m-%d') AS sale_date,
            COUNT(*) AS transaction_count,
            COALESCE(SUM(total_amount), 0) AS revenue
     FROM sales
     WHERE user_id = ? AND status = 'paid'
       AND sale_date >= CURDATE() - INTERVAL 89 DAY
     GROUP BY DATE_FORMAT(sale_date, '%Y-%m-%d')
     ORDER BY DATE_FORMAT(sale_date, '%Y-%m-%d') ASC`,
    [req.user.id]
  );

  return res.status(200).json({
    success: true,
    message: 'Data dashboard kasir berhasil diambil',
    data: {
      summary: {
        totalSalesToday: Number(todaySummary.total_sales),
        revenueToday: Number(todaySummary.revenue),
        itemsSoldToday: Number(itemsSoldToday.total),
        recentSales: recentSales.map(toRecentSaleResponse),
        salesTrend: salesTrend.map(toSalesTrendResponse)
      }
    }
  });
}

module.exports = {
  getCashierSummary,
  getSummary
};
