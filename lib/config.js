// exports all .env variables into a neat config object to pass around

const result = require('dotenv').config();

// TODO: probably check NODE_ENV and decide whether to throw error here
// or handle this differently
if (result.error) throw result.error;

module.exports = {
  nodePort: process.env.NODE_PORT,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoDb: process.env.MONGO_DB,
};
