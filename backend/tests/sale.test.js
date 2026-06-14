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

describe('Sale API', () => {
  it('requires bearer token for sale list', async () => {
    const response = await request(app).get('/api/sales').expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Token akses wajib dikirim'
    });
  });

  it('returns validation error when sale items are empty', async () => {
    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({
        paid_amount: 10000,
        items: []
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Item penjualan wajib diisi'
    });
  });

  it('returns validation error when payment method is invalid', async () => {
    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({
        payment_method: 'voucher',
        paid_amount: 10000,
        items: [{ product_id: 1, quantity: 1 }]
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Metode pembayaran tidak valid'
    });
  });

  it('returns validation error when item quantity is invalid', async () => {
    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({
        paid_amount: 10000,
        items: [{ product_id: 1, quantity: 0 }]
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Jumlah produk penjualan tidak valid'
    });
  });
});
