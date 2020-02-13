const db = require('../db/mongo');
const devLogger = require('./devLogger');

module.exports = async function apiIdentify(req, res, next) {
  const { subdomains } = req;
  const apiName = subdomains[0] || null;

  // handle no subdomain or www host
  // TODO: this should probably be handled by upstream nginx
  if (!apiName || apiName === 'www') {
    req.apiData = null;
    next();
  }

  let apiData;
  try {
    const coll = db.collection('config');
    apiData = await coll.find({ subdomain: apiName }).toArray();
    console.log(apiData);
    req.apiData = apiData;
  } catch (err) {
    req.apiData = null;
    devLogger(err, 'error');
  }
  next();
};
