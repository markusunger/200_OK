const store = require('../db/storeWrapper');
const devLogger = require('./devLogger');

module.exports = async function apiIdentify(req, res, next) {
  const { subdomains } = req;
  const apiName = subdomains[0] || null;

  console.log(`API name in apiIdentify is ${apiName}`);
  if (!apiName || apiName === 'www') next();

  try {
    const apiData = await store.getApiInfo(apiName);
    // this shouldn't be a 500 as well
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
