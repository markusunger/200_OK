/* eslint-disable */

// process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongo = require('../db/mongo');
const app = require('../app');
const seed = require('./seeds/mongo.seed');

beforeAll(seed);

describe('GET endpoint tests', () => {
  it('should return a 400 if the root path is requested', async (done) => {
    const response = await request(app)
      .get('/')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(400);
    expect(response.body.error[0]).toBe('no path specified');
    done();
  });

  it('should return a user', async (done) => {
    const response = await request(app)
      .get('/users/1')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Markus');
    expect(response.body.id).toBe(1);
    done();
  });

  it('should return a 404 when a not existing user is requested', async (done) => {
    const response = await request(app)
      .get('/users/7')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(404);
    expect(response.body.error[0]).toBe('No data found for users/7.');
    done();
  });

  it('should return a collection of users', async (done) => {
    const response = await request(app)
      .get('/users')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
    done();
  });

  it('should return a nested resource item', async(done) => {
    const response = await request(app)
      .get('/users/1/comments/1')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(200);
    expect(response.body.text).toBe('first comment');
    done();
  });
});

afterAll(async () => {
  await mongo.shutdown();
})