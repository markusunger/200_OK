/*
  returns an object that holds a reference to the database object (db)
  as well as an init method that creates the actual connection asynchronously
*/

const { MongoClient } = require('mongodb');
const config = require('../lib/config');
const devLogger = require('../lib/devLogger');

const Mongo = {
  init: async function init() {
    let host;
    let port;
    let db;

    switch (process.env.NODE_ENV) {
      case 'test':
        host = config.mongoHostTest;
        port = config.mongoPortTest;
        db = config.mongoDbTest;
        break;
      default:
        host = config.mongoHost;
        port = config.mongoPort;
        db = config.mongoDb;
    }

    this.client = new MongoClient(
      `mongodb://${host}:${port}/${db}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    try {
      await this.client.connect();
      this.db = this.client.db();
    } catch (error) {
      devLogger(error);
      this.db = null;
    }
    return this;
  },

  shutdown: async function shutdown() {
    await this.client.close(true);
  },
};

module.exports = Object.create(Mongo);
