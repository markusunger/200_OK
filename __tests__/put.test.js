/* eslint-disable */

const request = require('supertest');
const mongo = require('../db/mongo');
const app = require('../app');
const seed = require('./seeds/mongo.seed');

beforeAll(seed);

describe('PUT endpoint tests', () => {
  it('should update a single field of a resource item', async (done) => {
    let response = await request(app)
      .put('/users/3')
      .set('Host', 'envious-tesla.200ok.app')
      .send({
        name: 'Rick',
      });
    expect(response.status).toBe(204);

    // also check if the user was actually updated
    response = await request(app)
      .get('/users/3')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Rick');
    done();
  });

  it('should return a 400 if the item to update doesn\'t exist.', async (done) => {
    let response = await request(app)
      .put('/users/6')
      .set('Host', 'envious-tesla.200ok.app')
      .send({
        name: "Bilbo",
      });
    expect(response.status).toBe(400);
    expect(response.body.error[0]).toBe("Data could not be updated (most likely because the item doesn't exist).");

    // should also not accidentally create that item
    response = await request(app)
      .get('/users/6')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(404);
    done();
  });
});

afterAll(async (done) => {
  await mongo.shutdown();
  done();
});
