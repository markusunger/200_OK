module.exports = function validateRequest(req, res, next) {
  // no API name in request URI
  if (!req.apiName) {
    res.status(400);
    next(new Error('no API name specified'));
  }

  // root path of API requested
  if (!req.args) {
    res.status(400);
    next(new Error('no path specified'));
  }

  next();
};
