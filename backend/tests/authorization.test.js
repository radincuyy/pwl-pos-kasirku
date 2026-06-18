const request = require('supertest');

const app = require('../src/app');
const { signToken } = require('../src/utils/jwt');

function createRoleToken(role) {
  return signToken({
    id: 1,
    email: `${role}@kasirku.test`,
    role
  });
}

function withRole(requestBuilder, role) {
  return requestBuilder.set('Authorization', `Bearer ${createRoleToken(role)}`);
}

describe('Role authorization', () => {
  it('allows admin to reach category validation', async () => {
    const response = await withRole(
      request(app).post('/api/categories'),
      'admin'
    )
      .send({ name: '' })
      .expect(400);

    expect(response.body.message).toBe('Nama kategori wajib diisi');
  });

  it('blocks cashier from category management', async () => {
    const response = await withRole(
      request(app).post('/api/categories'),
      'kasir'
    )
      .send({ name: 'Kategori Baru' })
      .expect(403);

    expect(response.body.message).toBe('Anda tidak memiliki izin untuk mengakses fitur ini');
  });

  it('blocks owner from changing products', async () => {
    const response = await withRole(
      request(app).post('/api/products'),
      'owner'
    )
      .send({
        category_id: 1,
        supplier_id: 1,
        sku: 'SKU-OWNER',
        name: 'Produk Owner',
        purchase_price: 1000,
        selling_price: 1500,
        stock: 1,
        minimum_stock: 1
      })
      .expect(403);

    expect(response.body.message).toBe('Anda tidak memiliki izin untuk mengakses fitur ini');
  });

  it('blocks owner from changing customers', async () => {
    const response = await withRole(
      request(app).post('/api/customers'),
      'owner'
    )
      .send({ name: 'Pelanggan Owner' })
      .expect(403);

    expect(response.body.message).toBe('Anda tidak memiliki izin untuk mengakses fitur ini');
  });

  it('blocks cashier from changing products', async () => {
    const response = await withRole(
      request(app).delete('/api/products/1'),
      'kasir'
    ).expect(403);

    expect(response.body.message).toBe('Anda tidak memiliki izin untuk mengakses fitur ini');
  });

  it('allows cashier to reach sale validation', async () => {
    const response = await withRole(
      request(app).post('/api/sales'),
      'kasir'
    )
      .send({ paid_amount: 10000, items: [] })
      .expect(400);

    expect(response.body.message).toBe('Item penjualan wajib diisi');
  });

  it('blocks owner from creating sales', async () => {
    const response = await withRole(
      request(app).post('/api/sales'),
      'owner'
    )
      .send({
        paid_amount: 10000,
        items: [{ product_id: 1, quantity: 1 }]
      })
      .expect(403);

    expect(response.body.message).toBe('Anda tidak memiliki izin untuk mengakses fitur ini');
  });
});
