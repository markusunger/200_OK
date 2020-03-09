module.exports = function validateRequest(req, res, next) {
  const { response } = res.locals;

  // no API name in request URI
  if (!req.apiName) {
    response.status = 400;
    response.addError('no API name specified');
  }

  // root path of API requested
  if (!req.args || req.args.length === 0) {
    response.status = 400;
    response.addError('no path specified');
  }

  /* check for valid resource names
     must be only alphanumeric characters ([a-zA-Z0-9])
       or hyphen (-), underscore (_)
     maximum length 64 characters
     must start with a letter
     at maximum four nested resources are allowed
  */
  const resources = req.args ? req.args.filter((segment, idx) => idx % 2 === 0) : [];

  if (resources.length > 4) {
    response.status = 400;
    response.addError('A maximum number of four nested resources is allowed.');
  }

  if (resources.some(resource => resource.length > 64)) {
    response.status = 400;
    response.addError('Resource names must not be longer than 64 characters.');
  }

  const validCharacters = /^[a-zA-Z][a-zA-Z0-9-_]*$/;
  if (!resources.every(resource => validCharacters.test(resource))) {
    response.status = 400;
    response.addError('A resource name can only contain alphanumeric characters, hyphens and underscores and must start with a letter.');
  }

  /*
  resource ids must be numeric (since they are server-generated as incrementing integers)
  */
  const ids = req.args ? req.args.filter((segment, idx) => idx % 2 !== 0) : [];

  if (!ids.every(id => /^[0-9]*$/.test(id))) {
    response.status = 400;
    response.addError('A resource item id can only contain numeric characters.');
  }

  /* check for valid POST requests
     TODO:
      - handle encoding errors or is that already done by express.json()?
  */
  if (req.method === 'POST') {
    // check if body present and not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      response.status = 400;
      response.addError('no POST body sent or could not be parsed.');
    }

    // check if path is a valid resource collection (= odd number of path segments)
    if (req.args && req.args.length % 2 === 0) {
      response.status = 405;
      response.addError('cannot POST to individual resource item.');
    }
  }

  /* check for valid DELETE requests */
  if (req.method === 'DELETE') {
    // check if path is a valid resource item (= even number of path segments)
    if (req.args && req.args.length % 2 !== 0) {
      response.status = 400;
      response.addError('cannot DELETE whole collections, only specific items');
    }
  }

  /* check for valid PUT requests */
  if (req.method === 'PUT') {
    // check if body is present and not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      response.status = 400;
      response.addError('no PUT body sent or could not be parsed.');
    }
  }

  // send early error response if request is invalid
  if (response.hasErrors()) {
    res.status(response.status);
    res.json({
      error: response.errors,
    });
  } else {
    next();
  }
};
