/*
  handles the deletion of a specific resource item
*/

const store = require('../services/schemaless');

module.exports = async function deleteController(apiName, args, next) {
  let result;
  const itemId = parseInt(args[args.length - 1], 10);
  const itemPath = args.slice(0, args.length - 1).join('/');

  try {
    result = await store.deleteItem(apiName, itemId, itemPath, next);
  } catch (error) {
    next(error);
  }

  return result;
};
