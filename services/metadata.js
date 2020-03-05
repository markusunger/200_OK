const store = require('../db/mongo');

module.exports = (function metaService() {
  function createApiKey() {

  }

  return {
    // creates a new API config
    createApi: async function createApi(name) {
      let result;

      try {
        result = await store.db.collection('config').insertOne({
          apiName: name,
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
