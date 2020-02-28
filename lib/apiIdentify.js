const store = require('../db/storeWrapper');

module.exports = async function apiIdentify(req, res, next) {
  const { apiName } = req;

  try {
    const apiData = await store.getApiInfo(apiName, next);
    if (!apiData) {
      res.status(400);
      next(new Error(`API with the name '${apiName}' does not exist.`));
    }
  } catch (err) {
    next(err);
  }

  next();
};
