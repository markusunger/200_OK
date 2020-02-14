// wraps the database and provides an object with all necessary CRUD operations

const store = require('./mongo');
const devLogger = require('../lib/devLogger');

module.exports = (function storeWrapper() {
  store.init();

  return {
    getApiInfo: async function getApiInfo(apiName) {
      const result = await store.db.collection('config').findOne({ subdomain: apiName });
      return result;
    },

    getCollection: async function getCollection(apiName, collectionName) {

    },
  };
}());
