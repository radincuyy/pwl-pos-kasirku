const crypto = require('crypto');

const { pool } = require('../config/database');
const createHttpError = require('../utils/createHttpError');
const { clearProductDataCache } = require('../utils/cache');

const paymentMethods = ['cash', 'transfer', 'qris', 'debit'];

function toSaleSummaryResponse(sale) {
  return {
    id: sale.id,
    invoiceNumber: sale.invoice_number,
    userId: sale.user_id,
    cashierName: sale.cashier_name,
    customerId: sale.customer_id,
    customerName: sale.customer_name,
    totalAmount: Number(sale.total_amount),
    paidAmount: Number(sale.paid_amount),
    changeAmount: Number(sale.change_amount),
    paymentMethod: sale.payment_method,
    status: sale.status,
    saleDate: sale.sale_date,
    createdAt: sale.created_at,
    updatedAt: sale.updated_at
  };
}

function toSaleItemResponse(item) {
  return {
    id: item.id,
    productId: item.product_id,
    productSku: item.product_sku,
    productName: item.product_name,
    quantity: Number(item.quantity),
    price: Number(item.price),
    subtotal: Number(item.subtotal)
  };
}

function toSaleDetailResponse(sale, items) {
  return {
    ...toSaleSummaryResponse(sale),
    items: items.map(toSaleItemResponse)
  };
}

function normalizeRequiredId(value, errorMessage) {
  const normalizedValue = Number(value);

  if (!Number.isInteger(normalizedValue) || normalizedValue <= 0) {
    throw createHttpError(400, errorMessage);
  }

  return normalizedValue;
}

function normalizeOptionalId(value, errorMessage) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return normalizeRequiredId(value, errorMessage);
}

function normalizeMoney(value, errorMessage) {
  const normalizedValue = Number(value);

  if (value === undefined || value === null || value === '' || Number.isNaN(normalizedValue) || normalizedValue < 0) {
    throw createHttpError(400, errorMessage);
  }

  return normalizedValue;
}

function normalizePaymentMethod(value) {
  const normalizedValue = typeof value === 'string' && value.trim() ? value.trim() : 'cash';

  if (!paymentMethods.includes(normalizedValue)) {
    throw createHttpError(400, 'Metode pembayaran tidak valid');
  }

  return normalizedValue;
}

function normalizeSaleItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw createHttpError(400, 'Item penjualan wajib diisi');
  }

  const itemMap = new Map();

  items.forEach((item) => {
    const productId = normalizeRequiredId(item?.product_id, 'Produk penjualan wajib dipilih');
    const quantity = Number(item?.quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw createHttpError(400, 'Jumlah produk penjualan tidak valid');
    }

    itemMap.set(productId, (itemMap.get(productId) || 0) + quantity);
  });

  return Array.from(itemMap, ([productId, quantity]) => ({
    productId,
    quantity
  }));
}

function normalizeSalePayload(body) {
  return {
    customerId: normalizeOptionalId(body?.customer_id, 'Pelanggan tidak valid'),
    paymentMethod: normalizePaymentMethod(body?.payment_method),
    paidAmount: normalizeMoney(body?.paid_amount, 'Nominal bayar tidak valid'),
    items: normalizeSaleItems(body?.items)
  };
}

function formatDateStamp(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

function generateInvoiceNumber() {
  const dateStamp = formatDateStamp(new Date());
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();

  return `INV-${dateStamp}-${suffix}`;
}

async function findCustomerById(connection, id) {
  const [rows] = await connection.execute('SELECT id FROM customers WHERE id = ? LIMIT 1', [id]);

  return rows[0] || null;
}

async function findProductForUpdate(connection, id) {
  const [rows] = await connection.execute(
    `SELECT id, sku, name, selling_price, stock
     FROM products
     WHERE id = ?
     LIMIT 1
     FOR UPDATE`,
    [id]
  );

  return rows[0] || null;
}

async function findSaleById(id) {
  const [sales] = await pool.execute(
    `SELECT sales.id, sales.invoice_number, sales.user_id, users.name AS cashier_name,
            sales.customer_id, customers.name AS customer_name, sales.total_amount,
            sales.paid_amount, sales.change_amount,
            sales.payment_method, sales.status,
            sales.sale_date, sales.created_at, sales.updated_at
     FROM sales
     INNER JOIN users ON users.id = sales.user_id
     LEFT JOIN customers ON customers.id = sales.customer_id
     WHERE sales.id = ?
     LIMIT 1`,
    [id]
  );

  if (!sales[0]) {
    return null;
  }

  const [items] = await pool.execute(
    `SELECT sale_items.id, sale_items.product_id, products.sku AS product_sku,
            products.name AS product_name, sale_items.quantity, sale_items.price,
            sale_items.subtotal
     FROM sale_items
     INNER JOIN products ON products.id = sale_items.product_id
     WHERE sale_items.sale_id = ?
     ORDER BY sale_items.id ASC`,
    [id]
  );

  return toSaleDetailResponse(sales[0], items);
}

async function getSales(req, res) {
  const [rows] = await pool.execute(
    `SELECT sales.id, sales.invoice_number, sales.user_id, users.name AS cashier_name,
            sales.customer_id, customers.name AS customer_name, sales.total_amount,
            sales.paid_amount, sales.change_amount,
            sales.payment_method, sales.status,
            sales.sale_date, sales.created_at, sales.updated_at
     FROM sales
     INNER JOIN users ON users.id = sales.user_id
     LEFT JOIN customers ON customers.id = sales.customer_id
     ORDER BY sales.id DESC`
  );

  return res.status(200).json({
    success: true,
    message: 'Data penjualan berhasil diambil',
    data: {
      sales: rows.map(toSaleSummaryResponse)
    }
  });
}

async function getSaleById(req, res) {
  const sale = await findSaleById(req.params.id);

  if (!sale) {
    throw createHttpError(404, 'Penjualan tidak ditemukan');
  }

  return res.status(200).json({
    success: true,
    message: 'Detail penjualan berhasil diambil',
    data: {
      sale
    }
  });
}

async function createSale(req, res) {
  const payload = normalizeSalePayload(req.body);

  const connection = await pool.getConnection();
  let saleId = null;

  try {
    await connection.beginTransaction();

    if (payload.customerId) {
      const customer = await findCustomerById(connection, payload.customerId);

      if (!customer) {
        throw createHttpError(400, 'Pelanggan tidak ditemukan');
      }
    }

    const saleItems = [];
    let totalAmount = 0;

    for (const item of payload.items) {
      const product = await findProductForUpdate(connection, item.productId);

      if (!product) {
        throw createHttpError(400, 'Produk tidak ditemukan');
      }

      if (Number(product.stock) < item.quantity) {
        throw createHttpError(400, `Stok produk ${product.name} tidak mencukupi`);
      }

      const price = Number(product.selling_price);
      const subtotal = price * item.quantity;

      totalAmount += subtotal;
      saleItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price,
        subtotal
      });
    }

    if (payload.paidAmount < totalAmount) {
      throw createHttpError(400, 'Nominal bayar tidak mencukupi');
    }

    const invoiceNumber = generateInvoiceNumber();
    const changeAmount = payload.paidAmount - totalAmount;
    const [saleResult] = await connection.execute(
      `INSERT INTO sales
       (invoice_number, user_id, customer_id, total_amount, paid_amount, change_amount,
        payment_method, status, sale_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'paid', NOW())`,
      [
        invoiceNumber,
        req.user.id,
        payload.customerId,
        totalAmount,
        payload.paidAmount,
        changeAmount,
        payload.paymentMethod
      ]
    );
    saleId = saleResult.insertId;

    for (const item of saleItems) {
      await connection.execute(
        `INSERT INTO sale_items (sale_id, product_id, quantity, price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [saleId, item.productId, item.quantity, item.price, item.subtotal]
      );
      await connection.execute(
        `UPDATE products
         SET stock = stock - ?
         WHERE id = ?`,
        [item.quantity, item.productId]
      );
      await connection.execute(
        `INSERT INTO stock_movements (product_id, sale_id, type, quantity, description, created_by)
         VALUES (?, ?, 'out', ?, ?, ?)`,
        [
          item.productId,
          saleId,
          item.quantity,
          `Penjualan ${invoiceNumber}`,
          req.user.id
        ]
      );
    }

    await connection.commit();
    await clearProductDataCache();
  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      throw createHttpError(409, 'Nomor invoice sudah digunakan');
    }

    throw error;
  } finally {
    connection.release();
  }

  const sale = await findSaleById(saleId);

  return res.status(201).json({
    success: true,
    message: 'Penjualan berhasil dibuat',
    data: {
      sale
    }
  });
}

module.exports = {
  getSales,
  getSaleById,
  createSale
};
