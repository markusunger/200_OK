/* eslint-disable */

const request = require('supertest');
const mongo = require('../db/mongo');
const app = require('../app');
const seed = require('./seeds/mongo.seed');

beforeAll(seed);

describe('POST endpoint tests', () => {
  it('should receive a 405 when trying to POST to an individual resource item', async (done) => {
    const response = await request(app)
      .post('/users/1')
      .set('Host', 'envious-tesla.200ok.app')
      .send({
        name: 'whatever',
        isAdmin: false,
      });
    expect(response.status).toBe(405);
    expect(response.body.error[0]).toBe('cannot POST to individual resource item.');
    done();
  });

  it('should receive a 400 when POSTing with an empty body', async (done) => {
    const response = await request(app)
      .post('/users')
      .set('Host', 'envious-tesla.200ok.app')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.error[0]).toBe('no POST body sent or could not be parsed.');
    done();
  });

  it('should create a new user when requested with a valid request body', async (done) => {
    let response = await request(app)
      .post('/users')
      .set('Host', 'envious-tesla.200ok.app')
      .send({
        name: 'Gandalf',
        isAdmin: false,
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Gandalf');
    expect(response.body.isAdmin).toBe(false);
    expect(response.body.id).toBe(5);

    response = await request(app)
      .get('/users/5')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(200);
    expect(Object.keys(response.body).length).toBe(3);
    done();
  });
});


afterAll(async (done) => {
  await mongo.shutdown();
  done();
});
