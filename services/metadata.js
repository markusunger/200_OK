const crypto = require('crypto');

const store = require('../db/mongo');
const words = require('../lib/words');

module.exports = (function metaService() {
  function createApiName() {
    // TODO: prevent duplicates
    const adjective = words.adjectives[Math.floor(Math.random() * words.adjectives.length)];
    const name = words.names[Math.floor(Math.random() * words.names.length)];
    return `${adjective}-${name}`;
  }

  function createApiKey() {
    // this does not need to be as secure as a proper hash,
    // so a simple crypto randomization will suffice
    const key = crypto.randomBytes(12)
      .toString('hex')
      .toUpperCase()
      .match(/(.{4})/g)
      .join('-');
    return key;
  }

  return {
    // creates a new API config
    createApi: async function createApi() {
      let result;

      try {
        result = await store.db.collection('config').insertOne({
          apiName: createApiName(),
          createdAt: new Date(),
          apiKey: createApiKey(),
        });
      } catch (error) {
        throw (error);
      }

      if (!result || result.insertedCount < 1) {
        throw (new Error('Could not create new API.'));
      }

      return result.ops[0];
    },

    // retrieves metadata about the specified API
    getApiInfo: async function getApiInfo(apiName, next) {
      let result;

      try {
        result = await store.db.collection('config').findOne({
          subdomain: apiName,
        });
      } catch (error) {
        next(error);
      }
      return result;
    },
  };
}());
