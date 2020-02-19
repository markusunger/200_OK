module.exports = function validateRequest(req, res, next) {
  // no API name in request URI
  if (!req.apiName) {
    res.locals.status(400);
    res.locals.errors.push('no API name specified');
  }

  // root path of API requested
  if (!req.args) {
    res.locals.status(400);
    res.locals.errors.push('no path specified');
  }

  // check for valid body in POST requests
  // TODO: handle wrong encoding
  if (req.method === 'POST') {
    if (!req.body) {
      res.locals.status(400);
      res.locals.errors.push('no POST body sent.');
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
