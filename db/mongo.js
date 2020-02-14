/*
  returns an object that holds a reference to the database object (db)
  as well as an init method that makes the actual connection asynchronously
*/

const { MongoClient } = require('mongodb');
const config = require('../lib/config');
const devLogger = require('../lib/devLogger');

const Mongo = {
  init: async function init() {
    this.client = new MongoClient(
      `mongodb://${config.mongoHost}:${config.mongoPort}/${config.mongoDb}`,
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
};

module.exports = Object.create(Mongo);
