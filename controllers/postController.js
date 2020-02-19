/*
  handles creation of new resources and resource items

  TODO:
    - if POST to nested resource, check if parent item exists (e.g. POST to
      /users/42/comments, see if there is a user with id = 42)
*/

const devLogger = require('../lib/devLogger');
const store = require('../db/storeWrapper');

module.exports = async function postController(apiName, args, itemData, next) {
  let response;
  const itemPath = args.join('/');

  try {
    response = await store.createItem(apiName, itemData, itemPath);
  } catch (error) {
    next(error);
  }

  if (!response.insertedCount || response.insertedCount === 0) return null;
  if (response.ops && Array.isArray(response.ops)) {
    const { data } = response.ops[0];
    data.id = response.ops[0]._id;
    return data;
  }
  devLogger(new Error('Response handling in postController fell through!'));
  return null;
};
