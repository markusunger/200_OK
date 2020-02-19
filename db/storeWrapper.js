// wraps the database and provides an object with all necessary CRUD operations

/*
  TODO: - error handling
        - find solution to make item id and path properties independent (or at least
          impossible to change) from submitted item data
        - research about indexing and how an index for the path might improve speed
          or maybe even decrease it?

  Storage Design:
    Currently, the data store is a document database (MongoDB) that supports rich
    objects that translate well into the JavaScript object notation (they are JSON, after all)

    Each top-level resource (like /users or /posts) is stored in its own collection
    with each resource item as a separate document.

    Each collection uses materialized paths to store top level and nested resources and items

    Nested resources are represented by a path field that will be regexed to find items from
    such a nested resource or a complete nested resource itself

    The path field follows the same notation as the API route itself, so if there is a request to
    get /users/45/images/23/comments/5, the store looks for the following document:

    {
      id: 5,
      path: '/users/45/images/23/comments',
    }

    Important is the exact path match via regex to exclude any further nested resource matches
*/

const store = require('./mongo');

module.exports = (function storeWrapper() {
  function collectionName(apiName, collectionPath) {
    const topLevelCollection = collectionPath.split('/')[0];
    return `${apiName}?${topLevelCollection}`;
  }

  store.init();

  return {
    // retrieves metadata about the specified API
    getApiInfo: async function getApiInfo(apiName) {
      const result = await store.db.collection('config').findOne({
        subdomain: apiName,
      });
      return result;
    },

    // retrieves a complete collection
    // TODO: support pagination, sorting etc.
    getCollection: async function getCollection(apiName, collectionPath) {
      const collection = collectionName(apiName, collectionPath);
      const result = await store.db.collection(collection).find({
        path: {
          $regex: `^${collectionPath}$`,
        },
      }).toArray();
      return result;
    },

    // retrieves a specific item with an id from a collection
    getItem: async function getItem(apiName, itemId, itemPath) {
      const collection = collectionName(apiName, itemPath);
      const result = await store.db.collection(collection).findOne({
        id: itemId,
        path: {
          $regex: `^${itemPath}$`,
        },
      });
      return result;
    },

    // creates a new item in an existing or new collection
    // TODO: properly determine next item id ?
    createItem: async function createItem(apiName, itemId, itemData, itemPath) {
      const collection = collectionName(apiName, itemPath);

      // create new item with id, path and all item data
      // TODO: not just overwrite id and path properties
      const newItem = Object.assign({}, itemData);
      Object.assign(newItem, {
        id: itemId,
        path: itemPath,
      });

      const result = await store.db.collection(collection).insertOne(newItem);
      return result;
    },
  };
}());
