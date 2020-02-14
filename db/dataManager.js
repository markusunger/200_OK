// wraps the database and provides an objct with all necessary CRUD operations

const store = require('./mongo');
const devLogger = require('../lib/devLogger');

module.exports = (function dataManager() {
  store.init();

  return {
    getApiInfo: async function getApiInfo(apiName) {
      const result = await store.db.collection('config').findOne({ subdomain: apiName });
      return result;
    },
  };
}());
