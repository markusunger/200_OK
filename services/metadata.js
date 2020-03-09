const store = require('../db/mongo');

module.exports = {
  // retrieves metadata about the specified API
  getApiInfo: async function getApiInfo(apiName, next) {
    let result;

    try {
      result = await store.db.collection('apiConfig').findOne({
        apiName,
      });
    } catch (error) {
      next(error);
    }
    return result;
  },
};
