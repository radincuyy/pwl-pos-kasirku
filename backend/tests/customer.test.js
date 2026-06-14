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

describe('Customer API', () => {
  it('requires bearer token for customer list', async () => {
    const response = await request(app).get('/api/customers').expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Token akses wajib dikirim'
    });
  });

  it('returns validation error when customer name is empty on create', async () => {
    const response = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({ name: '' })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Nama pelanggan wajib diisi'
    });
  });

  it('returns validation error when customer name is empty on update', async () => {
    const response = await request(app)
      .put('/api/customers/1')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({ name: '' })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Nama pelanggan wajib diisi'
    });
  });
});
