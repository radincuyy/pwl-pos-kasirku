const { pool } = require('../config/database');
const createHttpError = require('../utils/createHttpError');
const { clearProductsCache } = require('../utils/cache');

function toSupplierResponse(supplier) {
  return {
    id: supplier.id,
    name: supplier.name,
    phone: supplier.phone,
    address: supplier.address,
    createdAt: supplier.created_at,
    updatedAt: supplier.updated_at
  };
}

function normalizeSupplierPayload(body) {
  const { name, phone, address } = body || {};
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedPhone = typeof phone === 'string' && phone.trim() ? phone.trim() : null;
  const normalizedAddress = typeof address === 'string' && address.trim() ? address.trim() : null;

  if (!normalizedName) {
    throw createHttpError(400, 'Nama supplier wajib diisi');
  }

  return {
    name: normalizedName,
    phone: normalizedPhone,
    address: normalizedAddress
  };
}

async function findSupplierById(id) {
  const [rows] = await pool.execute(
    `SELECT id, name, phone, address, created_at, updated_at
     FROM suppliers
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function getSuppliers(req, res) {
  const [rows] = await pool.execute(
    `SELECT id, name, phone, address, created_at, updated_at
     FROM suppliers
     ORDER BY id DESC`
  );

  return res.status(200).json({
    success: true,
    message: 'Data supplier berhasil diambil',
    data: {
      suppliers: rows.map(toSupplierResponse)
    }
  });
}

async function getSupplierById(req, res) {
  const supplier = await findSupplierById(req.params.id);

  if (!supplier) {
    throw createHttpError(404, 'Supplier tidak ditemukan');
  }

  return res.status(200).json({
    success: true,
    message: 'Detail supplier berhasil diambil',
    data: {
      supplier: toSupplierResponse(supplier)
    }
  });
}

async function createSupplier(req, res) {
  const payload = normalizeSupplierPayload(req.body);
  const [result] = await pool.execute(
    `INSERT INTO suppliers (name, phone, address)
     VALUES (?, ?, ?)`,
    [payload.name, payload.phone, payload.address]
  );
  const supplier = await findSupplierById(result.insertId);

  return res.status(201).json({
    success: true,
    message: 'Supplier berhasil ditambahkan',
    data: {
      supplier: toSupplierResponse(supplier)
    }
  });
}

async function updateSupplier(req, res) {
  const payload = normalizeSupplierPayload(req.body);
  const existingSupplier = await findSupplierById(req.params.id);

  if (!existingSupplier) {
    throw createHttpError(404, 'Supplier tidak ditemukan');
  }

  await clearProductsCache();

  await pool.execute(
    `UPDATE suppliers
     SET name = ?, phone = ?, address = ?
     WHERE id = ?`,
    [payload.name, payload.phone, payload.address, req.params.id]
  );

  const supplier = await findSupplierById(req.params.id);

  return res.status(200).json({
    success: true,
    message: 'Supplier berhasil diperbarui',
    data: {
      supplier: toSupplierResponse(supplier)
    }
  });
}

async function deleteSupplier(req, res) {
  const existingSupplier = await findSupplierById(req.params.id);

  if (!existingSupplier) {
    throw createHttpError(404, 'Supplier tidak ditemukan');
  }

  await clearProductsCache();

  try {
    await pool.execute('DELETE FROM suppliers WHERE id = ?', [req.params.id]);
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED' || error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw createHttpError(409, 'Supplier tidak dapat dihapus karena masih digunakan produk');
    }

    throw error;
  }

  return res.status(200).json({
    success: true,
    message: 'Supplier berhasil dihapus'
  });
}

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
