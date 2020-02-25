module.exports = function validateRequest(req, res, next) {
  // no API name in request URI
  if (!req.apiName) {
    res.locals.status = 400;
    res.locals.errors.push('no API name specified');
  }

  // root path of API requested
  if (!req.args || req.args.length === 0) {
    res.locals.status = 400;
    res.locals.errors.push('no path specified');
  }

  /* check for valid POST requests
     TODO:
      - handle encoding errors or is that already done by express.json()?
  */
  if (req.method === 'POST') {
    // check if body present and not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      res.locals.status = 400;
      res.locals.errors.push('no POST body sent or could not be parsed.');
    }

    // check if path is a valid resource collection (= odd number of path segments)
    if (req.args && req.args.length % 2 === 0) {
      res.locals.status = 405;
      res.locals.errors.push('cannot POST to individual resource item.');
    }
  }

  // send early error response if request is invalid
  if (res.locals.errors.length > 0) {
    res.status(res.locals.status);
    res.json({
      error: res.locals.errors,
    });
  } else {
    next();
  }
};
