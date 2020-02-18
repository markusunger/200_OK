/*
  handles all lookups from the request path and (eventually) parameters

  Getting resources or resource items is pretty easy when using a materialized path
  approach for the data store.
  The Store Wrapper handles extracting the correct path, all that's left to do
  is determine if a resource collection should be retrieved (odd number of arguments)
  or a resource item (even number of arguments, with the last arg being the item id)

  TODO:
    - handle possible type conversion for args (e.g. item id's to integer)
*/

const store = require('../db/storeWrapper');

module.exports = async function getController(apiName, args, next) {
  if (args.length % 2 !== 0) {
    // odd number of args = resource collection request
    const collectionPath = args.join('/');
    const data = await store.getCollection(apiName, collectionPath);
    return data;
  }

  // even number of args = resource item request
  const itemId = args.pop();
  const itemPath = args.join('/');
  const data = await store.getItem(apiName, itemId, itemPath);
  return data;
};
