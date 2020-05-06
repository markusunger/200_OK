// exports all .env variables into a neat config object to pass around
// also defines application configuration not living in the env variables

const result = require('dotenv').config();

// TODO: probably check NODE_ENV and decide whether to throw error here
// or handle this differently
if (result.error) throw result.error;

module.exports = {
  apiExpirationDays: 7,

  nodePort: process.env.NODE_PORT,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoDb: process.env.MONGO_DB,
  mongoHostTest: process.env.MONGO_HOST_TEST,
  mongoPortTest: process.env.MONGO_PORT_TEST,
  mongoDbTest: process.env.MONGO_DB_TEST,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PW,
};
