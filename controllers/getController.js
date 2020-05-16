/*
  handles all lookups from the request path and (eventually) query parameters

  Getting resources or resource items is pretty easy when using a materialized path
  approach for the data store.

  TODO:
    - properly handle possible type conversion for args (e.g. item id's to integer)
*/

const store = require('../services/schemaless');

module.exports = async function getController(apiName, args) {
  const targetIsCollection = args.length % 2 !== 0;
  const targetIsItem = args.length % 2 === 0;

  if (targetIsCollection) {
    const collectionPath = args.join('/');
    try {
      const result = await store.getCollection(apiName, collectionPath);
      return result;
    } catch (error) {
      throw (error);
    }
  }

  if (targetIsItem) {
    const itemId = parseInt(args[args.length - 1], 10);
    const itemPath = args.slice(0, args.length - 1).join('/');
    try {
      const result = await store.getItem(apiName, itemId, itemPath);
      return result;
    } catch (error) {
      throw (error);
    }
  }

  return false;
};
