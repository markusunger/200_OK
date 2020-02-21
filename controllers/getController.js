/*
  handles all lookups from the request path and (eventually) query parameters

  Getting resources or resource items is pretty easy when using a materialized path
  approach for the data store.
  The Store Wrapper handles extracting the correct path, all that's left to do
  is determine if a resource collection should be retrieved (odd number of arguments)
  or a resource item (even number of arguments, with the last arg being the item id)

  TODO:
    - handle possible type conversion for args (e.g. item id's to integer)
    - handle data retrieval errors? call next if e.g. database is down
*/

const store = require('../db/storeWrapper');

module.exports = async function getController(apiName, args, next) {
  let data;

  if (args.length % 2 !== 0) {
    // odd number of args = resource collection request
    const collectionPath = args.join('/');
    try {
      data = await store.getCollection(apiName, collectionPath);
    } catch (error) {
      next(error);
    }
  }

  if (args.length % 2 === 0) {
    // even number of args = resource item request
    let itemId = args[args.length - 1];
    if (/^\d*$/.test(itemId)) itemId = parseInt(itemId, 10);
    const itemPath = args.slice(0, args.length - 1).join('/');
    try {
      data = await store.getItem(apiName, itemId, itemPath);
    } catch (error) {
      next(error);
    }
  }

  return data;
};
