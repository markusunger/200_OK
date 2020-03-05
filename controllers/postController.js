/*
  handles creation of new resources and resource items

  TODO:
    - if POST to nested resource, check if parent item exists (e.g. POST to
      /users/42/comments, see if there is a user with id = 42)
*/

const devLogger = require('../lib/devLogger');
const store = require('../services/schemaless');

module.exports = async function postController(apiName, args, itemData, next) {
  let itemId;
  let result;
  const itemPath = args.join('/');

  try {
    itemId = await store.getNextHighestId(apiName, itemPath, next);
  } catch (error) {
    next(error);
  }

  if (!itemId) next(new Error('Unable to retrieve new item id.'));

  try {
    result = await store.createItem(apiName, itemId, itemData, itemPath, next);
  } catch (error) {
    next(error);
  }

  if (!result.insertedCount || result.insertedCount === 0) return null;
  if (result.ops && Array.isArray(result.ops)) {
    return result.ops[0].data;
  }
  devLogger(new Error('Response handling in postController fell through!'));
  return null;
};
