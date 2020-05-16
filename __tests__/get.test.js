/* eslint-disable */

const request = require('supertest');
const mongo = require('../db/mongo');
const app = require('../app');
const errors = require('../lib/errors');
const seed = require('./seeds/mongo.seed');

beforeAll(seed);

describe('GET endpoint tests', () => {
  it('should return a 400 if a non-existing API is requested', async (done) => {
    const response = await request(app)
      .get('/users')
      .set('Host', 'fnord.200ok.app');
    expect(response.status).toBe(400);
    expect(response.body.error[0]).toBe(errors('API_NOT_FOUND', ['fnord']));
    done();
  });

  it('should return a 400 if the root path is requested', async (done) => {
    const response = await request(app)
      .get('/')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(400);
    expect(response.body.error[0]).toBe(errors('NO_PATH'));
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
    expect(response.body.error[0]).toBe(errors('ITEM_NOT_FOUND', ['users/7']));
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

  it('should return a nested resource item', async (done) => {
    const response = await request(app)
      .get('/users/1/comments/1')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(200);
    expect(response.body.text).toBe('first comment');
    done();
  });
});

afterAll(async (done) => {
  await mongo.shutdown();
  done();
});
