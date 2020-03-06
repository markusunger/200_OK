/* eslint-disable */

const request = require('supertest');
const mongo = require('../db/mongo');
const app = require('../app');
const seed = require('./seeds/mongo.seed');

beforeAll(seed);

describe('request validation tests', () => {
  it('should return a 400 when more than four resources are nested', async(done) => {
    const response = await request(app)
      .get('/groups/6/users/3/images/4/comments/5/votes/6')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(400);
    expect(response.body.error[0]).toBe('A maximum number of four nested resources is allowed.');
    done();
  });

  it('should return a 400 when a resource name is longer than 64 characters', async(done) => {
    const response = await request(app)
      .get('/supercalifragilisticexpialidocioussupercalifragilisticexpialidocious')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(400);
    expect(response.body.error[0]).toBe('Resource names must not be longer than 64 characters.');
    done();
  });

  it('should return a 400 when a resource name includes non-allowed characters', async(done) => {
    const response = await request(app)
      .get('/non:allowed-räsource')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(400);
    expect(response.body.error[0]).toBe('A resource name can only contain alphanumeric characters, hyphens and underscores and must start with a letter.');
    done();
  });

  it('should return a 400 when a resource name does not start with a letter', async(done) => {
    const response = await request(app)
      .get('/_test')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(400);
    expect(response.body.error[0]).toBe('A resource name can only contain alphanumeric characters, hyphens and underscores and must start with a letter.');
    done();
  });

  it('should return a 400 and multiple errors if multiple violations of rules exist', async(done) => {
    const response = await request(app)
      .get('/my:test:resource/4/another/2/nested/5/resource/3/one-too-much')
      .set('Host', 'envious-tesla.200ok.app');
    expect(response.status).toBe(400);
    expect(response.body.error[0]).toBe('A maximum number of four nested resources is allowed.');
    expect(response.body.error[1]).toBe('A resource name can only contain alphanumeric characters, hyphens and underscores and must start with a letter.');
    done();
  });
});

afterAll(async (done) => {
  await mongo.shutdown();
  done();
});
