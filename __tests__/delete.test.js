/* eslint-disable */

const request = require('supertest');
const mongo = require('../db/mongo');
const app = require('../app');
const seed = require('./seeds/mongo.seed');

beforeAll(seed);

describe('PUT endpoint tests', () => {
  it('should return a 404 when a non-existing resource item is attempted to be deleted', async (done) => {
    const response = await request(app)
      .delete('/users/8')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(404);
    expect(response.body.error[0]).toBe( "Data could not be deleted (because it likely isn't there).");
    done();
  });

  it('should delete an existing item and return a 204', async (done) => {
    let response = await request(app)
      .delete('/users/2')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(204);

    // check if the item is actually deleted
    response = await request(app)
      .get('/users/2')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(404);
    done();
  });
});

afterAll(async (done) => {
  await mongo.shutdown();
  done();
});