/*
  handles updating of items

  needs to check and remove any id field to prevent overwriting it
*/

const store = require('../services/schemaless');

module.exports = async function putController(apiName, args, itemData) {
  let result;
  const itemId = parseInt(args[args.length - 1], 10);
  const itemPath = args.slice(0, args.length - 1).join('/');

  try {
    result = await store.updateItem(apiName, itemId, itemData, itemPath);
  } catch (error) {
    throw error;
  }

  return result;
};
