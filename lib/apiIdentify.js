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
    next(new Error('Request to non-API path or subdomain.'));
  }

  try {
    const apiData = await data.getApiInfo(apiName);
    if (!apiData) next(new Error('Request to non-existent API.'));
    req.apiData = apiData;
  } catch (err) {
    devLogger(err, 'error');
    next(err);
  }

  next();
};
