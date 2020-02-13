const result = require('dotenv').config();

if (result.error) throw result.error;

module.exports = {
  nodePort: process.env.NODE_PORT,
  mongoHost: process.env.MONGO_HOST,
  mongoPort: process.env.MONGO_PORT,
  mongoDb: process.env.MONGO_DB,
};
