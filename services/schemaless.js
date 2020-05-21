// wraps the database and provides an object with all necessary CRUD operations for the schemaless
// "intelligent" mode

const store = require('../db/mongo');

module.exports = (function schemalessService() {
  const getCollectionName = apiName => `api:${apiName}`;

  return {
    // retrieves a complete collection
    getCollection: async function getCollection(apiName, collectionPath) {
      let result;

      // directly map result array to only contain contents of data field
      // (this is a mongo cursor operation)
      try {
        result = await store.db.collection(getCollectionName(apiName)).find({
          path: {
            $regex: `^${collectionPath}$`,
          },
        }).map(item => item.data).toArray();
      } catch (error) {
        throw error;
      }

      return result || null;
    },

    // retrieves a specific item with an id from a collection
    getItem: async function getItem(apiName, itemId, itemPath) {
      let result;

      try {
        result = await store.db.collection(getCollectionName(apiName)).findOne({
          'data.id': itemId,
          path: itemPath,
        });
      } catch (error) {
        throw error;
      }

      return result ? result.data : null;
    },

    // verifies whether a certain item exists without returning any data
    verifyItem: async function verifyExistence(apiName, itemId, itemPath) {
      try {
        const doesExist = await store.db.collection(getCollectionName(apiName)).find({
          'data.id': itemId,
          path: itemPath,
        }).count() > 0;
        return doesExist;
      } catch (error) {
        throw error;
      }
    },

    // retrieves the next item id for a specific resource or creates a new
    // id entry in the id store
    // NOTE: even with upsert it's not possible to do this in one operation as both
    // $set and $setOnInsert can not reference the same field (nextId).
    // the next best solution is therefore to only make an insert when the update fails
    // because of the filter not resolving a document
    getNextHighestId: async function getNextHighestId(apiName, itemPath, next) {
      let result;

      // update if possible
      try {
        result = await store.db.collection('idStore').findOneAndUpdate({
          resource: `${apiName}:${itemPath}`,
        }, {
          $inc: {
            nextId: 1,
          },
        }, {
          projection: {
            nextId: 1,
          },
        });
      } catch (error) {
        next(error);
      }

      // create new id document for provided resource
      // sets result to null so that the fixed new id of 1 can be returned in the end
      if (!result.value) {
        try {
          result = await store.db.collection('idStore').insertOne({
            resource: `${apiName}:${itemPath}`,
            nextId: 2,
          });
        } catch (error) {
          next(error);
        }
        result = null;
      }

      return result ? result.value.nextId : 1;
    },

    // creates a new item in an existing or new collection
    createItem: async function createItem(apiName, itemId, itemData, itemPath, next) {
      let result;

      // TODO: make it better, but consider always overwriting any user-provided id property
      // eslint-disable-next-line no-param-reassign
      itemData.id = itemId;

      try {
        result = await store.db.collection(getCollectionName(apiName)).insertOne({
          path: itemPath,
          createdAt: new Date(),
          data: itemData,
        });
      } catch (error) {
        next(error);
      }
      return result;
    },

    deleteItem: async function deleteItem(apiName, itemId, itemPath) {
      let result;

      try {
        result = await store.db.collection(getCollectionName(apiName)).deleteOne({
          'data.id': itemId,
          path: itemPath,
        });
      } catch (error) {
        throw error;
      }

      return (result && result.deletedCount > 0) ? true : null;
    },

    deleteCollection: async function deleteCollection(apiName, itemPath) {
      // delete all collection items and children items
      const pathPattern = new RegExp(`^${itemPath}.*`);

      try {
        const { result } = await store.db.collection(getCollectionName(apiName)).deleteMany({
          path: pathPattern,
        });
        if (result.ok !== 1) return null;
      } catch (error) {
        throw error;
      }

      // delete entries for all affected collections from id store
      const idPattern = new RegExp(`^${apiName}:${itemPath}.*`);
      try {
        const { result } = await store.db.collection('idStore').deleteMany({
          resource: idPattern,
        });
        if (result.ok !== 1) return null;
      } catch (error) {
        throw error;
      }

      return true;
    },

    updateItem: async function updateItem(apiName, itemId, itemData, itemPath) {
      let result;

      // flatten itemData into object with 'data.<x>' keys to be able to properly $set,
      // also prevent id from being overwritten by client
      const insertData = Object.entries(itemData).reduce((obj, [key, value]) => {
        if (key !== 'id') Object.defineProperty(obj, `data.${key}`, { value, enumerable: true });
        return obj;
      }, {});

      // early return in case of empty dataset to update
      // (technically not an error, so it will return a 204)
      if (Object.entries(insertData).length === 0) return true;

      try {
        result = await store.db.collection(getCollectionName(apiName)).updateOne({
          'data.id': itemId,
          path: itemPath,
        }, {
          $set: insertData,
        });
      } catch (error) {
        throw error;
      }

      return (result && result.modifiedCount > 0) ? true : null;
    },
  };
}());
