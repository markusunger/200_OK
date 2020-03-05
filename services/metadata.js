const store = require('../db/mongo');

module.exports = (function metaService() {
  return {
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
