const request = require('supertest');

const app = require('../src/app');

describe('Health API', () => {
  it('returns API health information', async () => {
    const response = await request(app).get('/api/health').expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'KasirKu API is running',
      data: {
        service: 'kasirku-api',
        status: 'healthy'
      }
    });
    expect(response.body.data.timestamp).toEqual(expect.any(String));
  });

  it('returns JSON 404 response for unknown routes', async () => {
    const response = await request(app).get('/api/unknown-route').expect(404);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Route not found'
    });
  });
});
