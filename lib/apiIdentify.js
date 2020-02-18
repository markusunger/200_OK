const store = require('../db/storeWrapper');
const devLogger = require('./devLogger');

module.exports = async function apiIdentify(req, res, next) {
  const { subdomains } = req;
  const apiName = subdomains[0] || null;
  if (!apiName || apiName === 'www') next();

  try {
    const apiData = await store.getApiInfo(apiName);
    if (!apiData) {
      res.status(400);
      next(new Error('Request to non-existent API.'));
    }
    req.apiName = apiName;
  } catch (err) {
    devLogger(err, 'error');
    next(err);
  }

  next();
};
