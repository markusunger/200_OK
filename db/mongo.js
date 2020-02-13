const { MongoClient } = require('mongodb');
const config = require('../lib/config');
const devLogger = require('../lib/devLogger');

module.exports = (async function mongo() {
  const client = new MongoClient(
    `mongodb://${config.mongoHost}:${config.mongoPort}/${config.mongoDb}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );

  let dbObject;
  try {
    await client.connect();
    dbObject = client.db();
  } catch (err) {
    devLogger(err, 'error');
    process.exit();
  }
  return dbObject;
}());
