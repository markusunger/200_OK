module.exports = function validateRequest(req, res, next) {
  const { response } = res.locals;

  // no API name in request URI
  if (!req.apiName) {
    response.status = 400;
    response.addError('NO_API');
  }

  // root path of API requested
  if (!req.args || req.args.length === 0) {
    response.status = 400;
    response.addError('NO_PATH');
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
    response.addError('TOO_MANY_NESTED_RESOURCES');
  }

  if (resources.some(resource => resource.length > 64)) {
    response.status = 400;
    response.addError('RESOURCE_NAME_TOO_LONG');
  }

  const validCharacters = /^[a-zA-Z][a-zA-Z0-9-_]*$/;
  if (!resources.every(resource => validCharacters.test(resource))) {
    response.status = 400;
    response.addError('WRONG_RESOURCE_NAME');
  }

  /*
    resource ids must be numeric (since they are server-generated as incrementing integers)
  */
  const ids = req.args ? req.args.filter((segment, idx) => idx % 2 !== 0) : [];

  if (!ids.every(id => /^[0-9]*$/.test(id))) {
    response.status = 400;
    response.addError('WRONG_RESOURCE_ID');
  }

  /*
    check if client accepts json responses
  */
  if (!req.accepts('json')) {
    response.status = 406;
    response.addError('NO_OR_WRONG_ACCEPT');
  }

  /*
    check for appropriate Content-Type (application/json)
  */
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.get('Content-Type');
    if (contentType !== 'application/json') {
      response.status = 415;
      response.addError('WRONG_CONTENT_TYPE', contentType);
    }
  }

  /* check for valid POST requests
     TODO:
      - handle encoding errors or is that already done by express.json()?
  */
  if (req.method === 'POST') {
    // check if body present and not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      response.status = 400;
      response.addError('NO_OR_WRONG_POST_BODY');
    }

    // check if path is a valid resource collection (= odd number of path segments)
    if (req.args && req.args.length % 2 === 0) {
      response.status = 405;
      response.addError('POST_TO_RESOURCE_ITEM');
    }
  }

  /* check for valid DELETE requests */
  if (req.method === 'DELETE') {
    // check if path is a valid resource item (= even number of path segments)
    if (req.args && req.args.length % 2 !== 0) {
      response.status = 400;
      response.addError('DELETE_ON_COLLECTION');
    }
  }

  /* check for valid PUT requests */
  if (req.method === 'PUT') {
    // check if body is present and not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      response.status = 400;
      response.addError('NO_OR_WRONG_PUT_BODY');
    }
  }

  // send early error response if request is invalid
  if (response.hasErrors()) {
    response.send(res);
  } else {
    next();
  }
};
