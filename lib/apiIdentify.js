const store = require('../db/storeWrapper');

module.exports = async function apiIdentify(req, res, next) {
  const { subdomains } = req;
  const apiName = subdomains[0] || null;
  if (!apiName || apiName === 'www') next();

  try {
    const apiData = await store.getApiInfo(apiName, next);
    if (!apiData) {
      res.status(400);
      next(new Error(`API with the name '${apiName}' does not exist.`));
    }
    req.apiName = apiName;
  } catch (err) {
    next(err);
  }

  next();
};
