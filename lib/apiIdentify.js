const data = require('../db/dataManager');
const devLogger = require('./devLogger');

module.exports = async function apiIdentify(req, res, next) {
  const { subdomains } = req;
  const apiName = subdomains[0] || null;

  // handle no subdomain or www host
  // TODO: this should probably be handled by upstream nginx
  if (!apiName || apiName === 'www') {
    req.apiData = null;
    // let error handler take over
    throw new Error('Request to non-API path or subdomain.');
  }

  try {
    const apiData = await data.getApiInfo(apiName);
    req.apiData = apiData;
  } catch (err) {
    next(err);
    devLogger(err, 'error');
  }

  next();
};
