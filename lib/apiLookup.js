const store = require('../db/storeWrapper');

module.exports = async function apiLookup(req, res, next) {
  const { apiName } = req;
  const { response } = res.locals;

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
