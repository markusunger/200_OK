const store = require('../db/mongo');

module.exports = (function predefinedService() {
  return {
    getPredefinedBehavior: async function getPredefinedBehavior(apiName, path) {
      let result;

      try {
        result = await store.db.collection(`pre:${apiName}`).findOne({
          path,
        });
      } catch (error) {
        throw error;
      }

      return result ? result.data : null;
    },
  };
}());
