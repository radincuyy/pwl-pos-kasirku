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

describe('Supplier API', () => {
  it('requires bearer token for supplier list', async () => {
    const response = await request(app).get('/api/suppliers').expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Token akses wajib dikirim'
    });
  });

  it('returns validation error when supplier name is empty on create', async () => {
    const response = await request(app)
      .post('/api/suppliers')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({ name: '' })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Nama supplier wajib diisi'
    });
  });

  it('returns validation error when supplier name is empty on update', async () => {
    const response = await request(app)
      .put('/api/suppliers/1')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({ name: '' })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Nama supplier wajib diisi'
    });
  });
});
