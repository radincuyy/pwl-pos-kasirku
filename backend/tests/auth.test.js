const request = require('supertest');

const app = require('../src/app');

describe('Auth API', () => {
  it('returns validation error when login body is empty', async () => {
    const response = await request(app).post('/api/auth/login').expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Email dan password wajib diisi'
    });
  });

  it('returns validation error when login payload is incomplete', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@kasirku.test' })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Email dan password wajib diisi'
    });
  });

  it('requires bearer token for current user endpoint', async () => {
    const response = await request(app).get('/api/auth/me').expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Token akses wajib dikirim'
    });
  });

  it('rejects invalid bearer token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Token akses tidak valid atau kedaluwarsa'
    });
  });
});
