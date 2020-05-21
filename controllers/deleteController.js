/*
  handles the deletion of a specific resource item or collection
*/

const store = require('../services/schemaless');

module.exports = async function deleteController(apiName, args) {
  const targetIsCollection = args.length % 2 !== 0;
  const targetIsItem = args.length % 2 === 0;

  let result;

  if (targetIsItem) {
    const itemId = parseInt(args[args.length - 1], 10);
    const itemPath = args.slice(0, args.length - 1).join('/');

    try {
      result = await store.deleteItem(apiName, itemId, itemPath);
    } catch (error) {
      throw error;
    }
  }

  if (targetIsCollection) {
    const itemPath = args.join('/');

    try {
      result = await store.deleteCollection(apiName, itemPath);
    } catch (error) {
      throw error;
    }
  }

  return result;
};
