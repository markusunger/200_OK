const store = require('../db/mongo');

module.exports = (function predefinedService() {
  return {
    getPredefinedBehavior: async function getPredefinedBehavior(apiName, path, next) {
      let result;

      try {
        result = await store.db.collection(`pre:${apiName}`).findOne({
          apiName,
        });
      } catch (error) {
        next(error);
      }

      return result;
    },
  };
}());