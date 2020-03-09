const store = require('../services/metadata');

module.exports = async function apiLookup(req, res, next) {
  const { subdomains } = req;
  const { response } = res.locals;

  const apiName = subdomains[0] || null;
  req.apiName = apiName;

  try {
    const apiData = await store.getApiInfo(apiName, next);
    if (!apiData) {
      response.status = 400;
      next(new Error(`API with the name '${apiName}' does not exist.`));
    }
  } catch (err) {
    next(err);
  }

  next();
};
