const { pool } = require('../config/database');
const createHttpError = require('../utils/createHttpError');

function toProductResponse(product) {
  return {
    id: product.id,
    categoryId: product.category_id,
    supplierId: product.supplier_id,
    category: {
      id: product.category_id,
      name: product.category_name
    },
    supplier: {
      id: product.supplier_id,
      name: product.supplier_name
    },
    sku: product.sku,
    name: product.name,
    purchasePrice: Number(product.purchase_price),
    sellingPrice: Number(product.selling_price),
    stock: Number(product.stock),
    minimumStock: Number(product.minimum_stock),
    createdAt: product.created_at,
    updatedAt: product.updated_at
  };
}

function normalizeRequiredText(value, errorMessage) {
  const normalizedValue = typeof value === 'string' ? value.trim() : '';

  if (!normalizedValue) {
    throw createHttpError(400, errorMessage);
  }

  return normalizedValue;
}

function normalizeRequiredId(value, errorMessage) {
  const normalizedValue = Number(value);

  if (!Number.isInteger(normalizedValue) || normalizedValue <= 0) {
    throw createHttpError(400, errorMessage);
  }

  return normalizedValue;
}

function normalizeMoney(value, errorMessage) {
  const normalizedValue = value === undefined || value === null || value === '' ? 0 : Number(value);

  if (Number.isNaN(normalizedValue) || normalizedValue < 0) {
    throw createHttpError(400, errorMessage);
  }

  return normalizedValue;
}

function normalizeStock(value, errorMessage) {
  const normalizedValue = value === undefined || value === null || value === '' ? 0 : Number(value);

  if (!Number.isInteger(normalizedValue) || normalizedValue < 0) {
    throw createHttpError(400, errorMessage);
  }

  return normalizedValue;
}

function normalizeProductPayload(body) {
  const {
    category_id: categoryId,
    supplier_id: supplierId,
    sku,
    name,
    purchase_price: purchasePrice,
    selling_price: sellingPrice,
    stock,
    minimum_stock: minimumStock
  } = body || {};

  return {
    categoryId: normalizeRequiredId(categoryId, 'Kategori produk wajib dipilih'),
    supplierId: normalizeRequiredId(supplierId, 'Supplier produk wajib dipilih'),
    sku: normalizeRequiredText(sku, 'SKU produk wajib diisi'),
    name: normalizeRequiredText(name, 'Nama produk wajib diisi'),
    purchasePrice: normalizeMoney(purchasePrice, 'Harga beli tidak valid'),
    sellingPrice: normalizeMoney(sellingPrice, 'Harga jual tidak valid'),
    stock: normalizeStock(stock, 'Stok tidak valid'),
    minimumStock: normalizeStock(minimumStock, 'Minimum stok tidak valid')
  };
}

async function findCategoryById(id) {
  const [rows] = await pool.execute('SELECT id FROM categories WHERE id = ? LIMIT 1', [id]);

  return rows[0] || null;
}

async function findSupplierById(id) {
  const [rows] = await pool.execute('SELECT id FROM suppliers WHERE id = ? LIMIT 1', [id]);

  return rows[0] || null;
}

async function ensureProductRelations(payload) {
  const [category, supplier] = await Promise.all([
    findCategoryById(payload.categoryId),
    findSupplierById(payload.supplierId)
  ]);

  if (!category) {
    throw createHttpError(400, 'Kategori tidak ditemukan');
  }

  if (!supplier) {
    throw createHttpError(400, 'Supplier tidak ditemukan');
  }
}

async function findProductById(id) {
  const [rows] = await pool.execute(
    `SELECT products.id, products.category_id, products.supplier_id, products.sku,
            products.name, products.purchase_price, products.selling_price,
            products.stock, products.minimum_stock, products.created_at,
            products.updated_at, categories.name AS category_name,
            suppliers.name AS supplier_name
     FROM products
     INNER JOIN categories ON categories.id = products.category_id
     INNER JOIN suppliers ON suppliers.id = products.supplier_id
     WHERE products.id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function getProducts(req, res) {
  const [rows] = await pool.execute(
    `SELECT products.id, products.category_id, products.supplier_id, products.sku,
            products.name, products.purchase_price, products.selling_price,
            products.stock, products.minimum_stock, products.created_at,
            products.updated_at, categories.name AS category_name,
            suppliers.name AS supplier_name
     FROM products
     INNER JOIN categories ON categories.id = products.category_id
     INNER JOIN suppliers ON suppliers.id = products.supplier_id
     ORDER BY products.id DESC`
  );

  return res.status(200).json({
    success: true,
    message: 'Data produk berhasil diambil',
    data: {
      products: rows.map(toProductResponse)
    }
  });
}

async function getProductById(req, res) {
  const product = await findProductById(req.params.id);

  if (!product) {
    throw createHttpError(404, 'Produk tidak ditemukan');
  }

  return res.status(200).json({
    success: true,
    message: 'Detail produk berhasil diambil',
    data: {
      product: toProductResponse(product)
    }
  });
}

async function createProduct(req, res) {
  const payload = normalizeProductPayload(req.body);
  await ensureProductRelations(payload);

  try {
    const [result] = await pool.execute(
      `INSERT INTO products
       (category_id, supplier_id, sku, name, purchase_price, selling_price, stock, minimum_stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.categoryId,
        payload.supplierId,
        payload.sku,
        payload.name,
        payload.purchasePrice,
        payload.sellingPrice,
        payload.stock,
        payload.minimumStock
      ]
    );
    const product = await findProductById(result.insertId);

    return res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: {
        product: toProductResponse(product)
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createHttpError(409, 'SKU produk sudah digunakan');
    }

    throw error;
  }
}

async function updateProduct(req, res) {
  const payload = normalizeProductPayload(req.body);
  const existingProduct = await findProductById(req.params.id);

  if (!existingProduct) {
    throw createHttpError(404, 'Produk tidak ditemukan');
  }

  await ensureProductRelations(payload);

  try {
    await pool.execute(
      `UPDATE products
       SET category_id = ?, supplier_id = ?, sku = ?, name = ?,
           purchase_price = ?, selling_price = ?, stock = ?, minimum_stock = ?
       WHERE id = ?`,
      [
        payload.categoryId,
        payload.supplierId,
        payload.sku,
        payload.name,
        payload.purchasePrice,
        payload.sellingPrice,
        payload.stock,
        payload.minimumStock,
        req.params.id
      ]
    );
    const product = await findProductById(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Produk berhasil diperbarui',
      data: {
        product: toProductResponse(product)
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createHttpError(409, 'SKU produk sudah digunakan');
    }

    throw error;
  }
}

async function deleteProduct(req, res) {
  const existingProduct = await findProductById(req.params.id);

  if (!existingProduct) {
    throw createHttpError(404, 'Produk tidak ditemukan');
  }

  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED' || error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw createHttpError(409, 'Produk tidak dapat dihapus karena sudah digunakan transaksi atau stok');
    }

    throw error;
  }

  return res.status(200).json({
    success: true,
    message: 'Produk berhasil dihapus'
  });
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
