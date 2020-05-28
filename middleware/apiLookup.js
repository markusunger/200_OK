const store = require('../services/metadata');

module.exports = async function apiLookup(req, res, next) {
  const { subdomains } = req;
  const { response } = res.locals;

  req.apiName = subdomains[0] || null;

  try {
    const apiData = await store.getApiInfo(req.apiName);

    if (!apiData) {
      response.status = 400;
      response.addError('API_NOT_FOUND', req.apiName);
      response.send(req, res);
    } else {
      req.apiDetails = apiData;
      next();
    }
  } catch (err) {
    next(err);
  }
};
