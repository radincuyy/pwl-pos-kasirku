const request = require('supertest');

const app = require('../src/app');
const { signToken } = require('../src/utils/jwt');

function createTestToken() {
  return signToken({
    id: 1,
    email: 'admin@kasirku.test',
    role: 'admin'
  });
}

describe('Product API', () => {
  it('requires bearer token for product list', async () => {
    const response = await request(app).get('/api/products').expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Token akses wajib dikirim'
    });
  });

  it('returns validation error when product category is empty on create', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({})
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Kategori produk wajib dipilih'
    });
  });

  it('returns validation error when product name is empty on update', async () => {
    const response = await request(app)
      .put('/api/products/1')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({
        category_id: 1,
        supplier_id: 1,
        sku: 'SKU-001',
        name: '',
        purchase_price: 1000,
        selling_price: 1500,
        stock: 10,
        minimum_stock: 2
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Nama produk wajib diisi'
    });
  });

  it('returns validation error when product stock is negative on create', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({
        category_id: 1,
        supplier_id: 1,
        sku: 'SKU-001',
        name: 'Produk Test',
        purchase_price: 1000,
        selling_price: 1500,
        stock: -1,
        minimum_stock: 2
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Stok tidak valid'
    });
  });
});
