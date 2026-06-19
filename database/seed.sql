-- Default login credentials:
-- admin@kasirku.test / Admin12345
-- kasir@kasirku.test / Admin12345
-- owner@kasirku.test / Admin12345

INSERT INTO roles (name)
VALUES ('admin'), ('kasir'), ('owner')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (role_id, name, email, password_hash)
SELECT roles.id, seed_users.name, seed_users.email, seed_users.password_hash
FROM (
  SELECT
    'admin' AS role_name,
    'Administrator' AS name,
    'admin@kasirku.test' AS email,
    '$2b$10$ocZtjmgeczegEDF4PRbOK.l7Oj1Qnzxt5z7c.qLympyVTNpisoa3O' AS password_hash
  UNION ALL
  SELECT
    'kasir',
    'Kasir Toko',
    'kasir@kasirku.test',
    '$2b$10$ocZtjmgeczegEDF4PRbOK.l7Oj1Qnzxt5z7c.qLympyVTNpisoa3O'
  UNION ALL
  SELECT
    'owner',
    'Pemilik Toko',
    'owner@kasirku.test',
    '$2b$10$ocZtjmgeczegEDF4PRbOK.l7Oj1Qnzxt5z7c.qLympyVTNpisoa3O'
) AS seed_users
INNER JOIN roles ON roles.name = seed_users.role_name
ON DUPLICATE KEY UPDATE
  role_id = VALUES(role_id),
  name = VALUES(name),
  password_hash = VALUES(password_hash);

INSERT INTO categories (name, description)
SELECT seed_categories.name, seed_categories.description
FROM (
  SELECT 'Minuman' AS name, 'Produk minuman siap konsumsi' AS description
  UNION ALL
  SELECT 'Makanan Ringan', 'Camilan dan makanan ringan kemasan'
  UNION ALL
  SELECT 'Kebutuhan Pokok', 'Bahan kebutuhan rumah tangga harian'
  UNION ALL
  SELECT 'Perawatan Diri', 'Produk kebersihan dan perawatan pribadi'
  UNION ALL
  SELECT 'Perlengkapan Rumah', 'Perlengkapan kebersihan dan rumah tangga'
) AS seed_categories
WHERE NOT EXISTS (
  SELECT 1
  FROM categories
  WHERE categories.name = seed_categories.name
);

INSERT INTO suppliers (name, phone, address)
SELECT seed_suppliers.name, seed_suppliers.phone, seed_suppliers.address
FROM (
  SELECT
    'PT Sumber Makmur' AS name,
    '0215550101' AS phone,
    'Jakarta Pusat' AS address
  UNION ALL
  SELECT 'CV Pangan Nusantara', '0215550102', 'Jakarta Timur'
  UNION ALL
  SELECT 'PT Bersih Sejahtera', '0215550103', 'Tangerang'
  UNION ALL
  SELECT 'UD Mitra Retail', '0215550104', 'Bekasi'
) AS seed_suppliers
WHERE NOT EXISTS (
  SELECT 1
  FROM suppliers
  WHERE suppliers.name = seed_suppliers.name
    AND suppliers.phone = seed_suppliers.phone
);

INSERT INTO customers (name, phone, address)
SELECT seed_customers.name, seed_customers.phone, seed_customers.address
FROM (
  SELECT
    'Andi Pratama' AS name,
    '081234567801' AS phone,
    'Jakarta Selatan' AS address
  UNION ALL
  SELECT 'Siti Rahma', '081234567802', 'Jakarta Timur'
  UNION ALL
  SELECT 'Budi Santoso', '081234567803', 'Depok'
  UNION ALL
  SELECT 'Nadia Putri', '081234567804', 'Bekasi'
  UNION ALL
  SELECT 'Rizky Maulana', '081234567805', 'Tangerang'
) AS seed_customers
WHERE NOT EXISTS (
  SELECT 1
  FROM customers
  WHERE customers.phone = seed_customers.phone
);

INSERT INTO products (
  category_id,
  supplier_id,
  sku,
  name,
  purchase_price,
  selling_price,
  stock,
  minimum_stock
)
SELECT
  (
    SELECT categories.id
    FROM categories
    WHERE categories.name = seed_products.category_name
    ORDER BY categories.id
    LIMIT 1
  ),
  (
    SELECT suppliers.id
    FROM suppliers
    WHERE suppliers.name = seed_products.supplier_name
    ORDER BY suppliers.id
    LIMIT 1
  ),
  seed_products.sku,
  seed_products.name,
  seed_products.purchase_price,
  seed_products.selling_price,
  seed_products.stock,
  seed_products.minimum_stock
FROM (
  SELECT
    'MNM-001' AS sku,
    'Air Mineral 600 ml' AS name,
    'Minuman' AS category_name,
    'PT Sumber Makmur' AS supplier_name,
    2500 AS purchase_price,
    4000 AS selling_price,
    40 AS stock,
    10 AS minimum_stock
  UNION ALL
  SELECT 'MNM-002', 'Teh Botol 350 ml', 'Minuman', 'PT Sumber Makmur', 4000, 6000, 24, 8
  UNION ALL
  SELECT 'MNM-003', 'Kopi Susu Kaleng', 'Minuman', 'CV Pangan Nusantara', 6500, 9000, 5, 5
  UNION ALL
  SELECT 'MKN-001', 'Keripik Kentang', 'Makanan Ringan', 'CV Pangan Nusantara', 7000, 10000, 18, 5
  UNION ALL
  SELECT 'MKN-002', 'Biskuit Cokelat', 'Makanan Ringan', 'CV Pangan Nusantara', 6000, 8500, 3, 5
  UNION ALL
  SELECT 'MKN-003', 'Mi Instan Goreng', 'Makanan Ringan', 'UD Mitra Retail', 2500, 3500, 36, 12
  UNION ALL
  SELECT 'PKK-001', 'Beras Premium 5 kg', 'Kebutuhan Pokok', 'UD Mitra Retail', 65000, 75000, 12, 4
  UNION ALL
  SELECT 'PKK-002', 'Minyak Goreng 1 liter', 'Kebutuhan Pokok', 'UD Mitra Retail', 15000, 18000, 15, 5
  UNION ALL
  SELECT 'PRW-001', 'Sabun Mandi Batang', 'Perawatan Diri', 'PT Bersih Sejahtera', 3500, 5500, 20, 6
  UNION ALL
  SELECT 'PRW-002', 'Sampo Botol 170 ml', 'Perawatan Diri', 'PT Bersih Sejahtera', 14000, 18000, 0, 4
  UNION ALL
  SELECT 'RMH-001', 'Deterjen Bubuk 800 gram', 'Perlengkapan Rumah', 'PT Bersih Sejahtera', 16000, 21000, 9, 3
  UNION ALL
  SELECT 'RMH-002', 'Tisu Wajah 250 lembar', 'Perlengkapan Rumah', 'PT Bersih Sejahtera', 9000, 12500, 6, 6
) AS seed_products
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  supplier_id = VALUES(supplier_id),
  name = VALUES(name),
  purchase_price = VALUES(purchase_price),
  selling_price = VALUES(selling_price),
  minimum_stock = VALUES(minimum_stock);
