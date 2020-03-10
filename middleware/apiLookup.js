const store = require('../services/metadata');
const errorMessage = require('../lib/errors');

module.exports = async function apiLookup(req, res, next) {
  const { subdomains } = req;
  const { response } = res.locals;

  const apiName = subdomains[0] || null;
  req.apiName = apiName;

  try {
    const apiData = await store.getApiInfo(apiName, next);
    if (!apiData) {
      response.status = 400;
      next(new Error(errorMessage('API_NOT_FOUND', apiName)));
    }
  } catch (err) {
    next(err);
  }

  next();
};
