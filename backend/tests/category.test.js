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

describe('Category API', () => {
  it('requires bearer token for category list', async () => {
    const response = await request(app).get('/api/categories').expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Token akses wajib dikirim'
    });
  });

  it('returns validation error when category name is empty on create', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({ name: '' })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Nama kategori wajib diisi'
    });
  });

  it('returns validation error when category name is empty on update', async () => {
    const response = await request(app)
      .put('/api/categories/1')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({ name: '' })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Nama kategori wajib diisi'
    });
  });
});
