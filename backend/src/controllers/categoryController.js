const { pool } = require('../config/database');
const createHttpError = require('../utils/createHttpError');
const { clearProductDataCache } = require('../utils/cache');

function toCategoryResponse(category) {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.created_at,
    updatedAt: category.updated_at
  };
}

function normalizeCategoryPayload(body) {
  const { name, description } = body || {};
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedDescription = typeof description === 'string' && description.trim()
    ? description.trim()
    : null;

  if (!normalizedName) {
    throw createHttpError(400, 'Nama kategori wajib diisi');
  }

  return {
    name: normalizedName,
    description: normalizedDescription
  };
}

async function findCategoryById(id) {
  const [rows] = await pool.execute(
    `SELECT id, name, description, created_at, updated_at
     FROM categories
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function getCategories(req, res) {
  const [rows] = await pool.execute(
    `SELECT id, name, description, created_at, updated_at
     FROM categories
     ORDER BY id DESC`
  );

  return res.status(200).json({
    success: true,
    message: 'Data kategori berhasil diambil',
    data: {
      categories: rows.map(toCategoryResponse)
    }
  });
}

async function getCategoryById(req, res) {
  const category = await findCategoryById(req.params.id);

  if (!category) {
    throw createHttpError(404, 'Kategori tidak ditemukan');
  }

  return res.status(200).json({
    success: true,
    message: 'Detail kategori berhasil diambil',
    data: {
      category: toCategoryResponse(category)
    }
  });
}

async function createCategory(req, res) {
  const payload = normalizeCategoryPayload(req.body);
  const [result] = await pool.execute(
    `INSERT INTO categories (name, description)
     VALUES (?, ?)`,
    [payload.name, payload.description]
  );
  const category = await findCategoryById(result.insertId);

  return res.status(201).json({
    success: true,
    message: 'Kategori berhasil ditambahkan',
    data: {
      category: toCategoryResponse(category)
    }
  });
}

async function updateCategory(req, res) {
  const payload = normalizeCategoryPayload(req.body);
  const existingCategory = await findCategoryById(req.params.id);

  if (!existingCategory) {
    throw createHttpError(404, 'Kategori tidak ditemukan');
  }

  await pool.execute(
    `UPDATE categories
     SET name = ?, description = ?
     WHERE id = ?`,
    [payload.name, payload.description, req.params.id]
  );
  await clearProductDataCache();

  const category = await findCategoryById(req.params.id);

  return res.status(200).json({
    success: true,
    message: 'Kategori berhasil diperbarui',
    data: {
      category: toCategoryResponse(category)
    }
  });
}

async function deleteCategory(req, res) {
  const existingCategory = await findCategoryById(req.params.id);

  if (!existingCategory) {
    throw createHttpError(404, 'Kategori tidak ditemukan');
  }

  try {
    await pool.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED' || error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw createHttpError(409, 'Kategori tidak dapat dihapus karena masih digunakan produk');
    }

    throw error;
  }
  await clearProductDataCache();

  return res.status(200).json({
    success: true,
    message: 'Kategori berhasil dihapus'
  });
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
