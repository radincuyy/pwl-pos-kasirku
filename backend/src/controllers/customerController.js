const { pool } = require('../config/database');
const createHttpError = require('../utils/createHttpError');

function toCustomerResponse(customer) {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    address: customer.address,
    createdAt: customer.created_at,
    updatedAt: customer.updated_at
  };
}

function normalizeCustomerPayload(body) {
  const { name, phone, address } = body || {};
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedPhone = typeof phone === 'string' && phone.trim() ? phone.trim() : null;
  const normalizedAddress = typeof address === 'string' && address.trim() ? address.trim() : null;

  if (!normalizedName) {
    throw createHttpError(400, 'Nama pelanggan wajib diisi');
  }

  return {
    name: normalizedName,
    phone: normalizedPhone,
    address: normalizedAddress
  };
}

async function findCustomerById(id) {
  const [rows] = await pool.execute(
    `SELECT id, name, phone, address, created_at, updated_at
     FROM customers
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function getCustomers(req, res) {
  const [rows] = await pool.execute(
    `SELECT id, name, phone, address, created_at, updated_at
     FROM customers
     ORDER BY id DESC`
  );

  return res.status(200).json({
    success: true,
    message: 'Data pelanggan berhasil diambil',
    data: {
      customers: rows.map(toCustomerResponse)
    }
  });
}

async function getCustomerById(req, res) {
  const customer = await findCustomerById(req.params.id);

  if (!customer) {
    throw createHttpError(404, 'Pelanggan tidak ditemukan');
  }

  return res.status(200).json({
    success: true,
    message: 'Detail pelanggan berhasil diambil',
    data: {
      customer: toCustomerResponse(customer)
    }
  });
}

async function createCustomer(req, res) {
  const payload = normalizeCustomerPayload(req.body);
  const [result] = await pool.execute(
    `INSERT INTO customers (name, phone, address)
     VALUES (?, ?, ?)`,
    [payload.name, payload.phone, payload.address]
  );
  const customer = await findCustomerById(result.insertId);

  return res.status(201).json({
    success: true,
    message: 'Pelanggan berhasil ditambahkan',
    data: {
      customer: toCustomerResponse(customer)
    }
  });
}

async function updateCustomer(req, res) {
  const payload = normalizeCustomerPayload(req.body);
  const existingCustomer = await findCustomerById(req.params.id);

  if (!existingCustomer) {
    throw createHttpError(404, 'Pelanggan tidak ditemukan');
  }

  await pool.execute(
    `UPDATE customers
     SET name = ?, phone = ?, address = ?
     WHERE id = ?`,
    [payload.name, payload.phone, payload.address, req.params.id]
  );

  const customer = await findCustomerById(req.params.id);

  return res.status(200).json({
    success: true,
    message: 'Pelanggan berhasil diperbarui',
    data: {
      customer: toCustomerResponse(customer)
    }
  });
}

async function deleteCustomer(req, res) {
  const existingCustomer = await findCustomerById(req.params.id);

  if (!existingCustomer) {
    throw createHttpError(404, 'Pelanggan tidak ditemukan');
  }

  try {
    await pool.execute('DELETE FROM customers WHERE id = ?', [req.params.id]);
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED' || error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw createHttpError(409, 'Pelanggan tidak dapat dihapus karena masih digunakan transaksi');
    }

    throw error;
  }

  return res.status(200).json({
    success: true,
    message: 'Pelanggan berhasil dihapus'
  });
}

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
