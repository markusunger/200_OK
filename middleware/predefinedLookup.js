const store = require('../services/predefined');

module.exports = async function predefinedLookup(req, res, next) {
  const { apiName, path } = req;

  try {
    const preData = await store.getPredefinedBehavior(apiName, path);
    req.predefined = preData || null;
  } catch (error) {
    next(error);
  }
  next();
};
