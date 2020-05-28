const express = require('express');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const Response = require('../lib/response');

const apiLookup = require('../middleware/apiLookup');
const pathExtractor = require('../middleware/pathExtractor');
const apiAuthorization = require('../middleware/apiAuthorization');
const validateRequest = require('../middleware/validateRequest');
const predefinedLookup = require('../middleware/predefinedLookup');
const validateParent = require('../middleware/validateParent');
const cors = require('../middleware/cors');

const getController = require('../controllers/getController');
const postController = require('../controllers/postController');
const deleteController = require('../controllers/deleteController');
const putController = require('../controllers/putController');

const env = process.env.NODE_ENV || 'development';

const main = express.Router();

// set up rate limiter for external API requests
// with 10 requests allowed per second
const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 1,
});

// set up custom response object
main.use((req, res, next) => {
  res.locals.response = new Response();
  return next();
});

// rate limiting first to send 429 without any database lookups
// when too many requests were sent
main.use(async (req, res, next) => {
  const { hostname } = req;
  const { response } = res.locals;
  try {
    await rateLimiter.consume(hostname, 1);
  } catch (err) {
    response.status = 429;
    response.addError('TOO_MANY_REQUESTS');
    response.send(req, res);
  }
  return next();
});

// request handling middleware
main.use(apiLookup);
main.use(pathExtractor);

main.use(apiAuthorization);

// validates request and sends early error response if invalid request
main.use(validateRequest);

// look up predefined custom endpoint behavior and populate request object
// so that CORS can properly handle OPTIONS requests
main.use(predefinedLookup);

// handle check for existing parent collection/item when
// requesting a nested reosurce collection or item
main.use(validateParent);

// CORS support and general OPTIONS request responses
main.use(cors());

/*
  --------------------
  custom behavior handler
  --------------------
*/

main.all('*', (req, res, next) => {
  const { predefined, method } = req;
  const { response } = res.locals;

  // skip if no predefined response exists
  if (!predefined) return next();

  // check if method is allowed
  if (!Object.prototype.hasOwnProperty.call(predefined, method)) {
    response.status = 405;
    response.addError('NO_PREDEFINED_METHOD', method);
    return next();
  }

  response.status = 200;
  response.body = predefined[method];
  return next();
});

const skipPredefined = (req, res, next) => {
  if (req.predefined) return next('route');
  return next();
};

/*
  --------------------
  HTTP method handlers
  --------------------
*/

main.get('*', skipPredefined, async (req, res, next) => {
  const { apiName, args } = req;
  const { response } = res.locals;

  try {
    const data = await getController(apiName, args);
    if (!data) {
      response.status = 404;
      response.addError('ITEM_NOT_FOUND', args.join('/'));
    } else {
      response.status = 200;
      response.body = data;
    }
  } catch (error) {
    next(error);
  }
  next();
});

main.post('*', skipPredefined, async (req, res, next) => {
  const { apiName, args, body } = req;
  const { response } = res.locals;

  try {
    const data = await postController(apiName, args, body, next);
    if (!data) {
      response.status = 400;
      response.addError('POST_UNSUCCESSFUL');
    } else {
      response.status = 201;
      response.body = data;
    }
  } catch (error) {
    next(error);
  }
  next();
});

main.put('*', skipPredefined, async (req, res, next) => {
  const { apiName, args, body } = req;
  const { response } = res.locals;

  try {
    const data = await putController(apiName, args, body);
    if (!data) {
      response.status = 400;
      response.addError('PUT_UNSUCCESSFUL');
    } else {
      response.status = 204;
    }
  } catch (error) {
    next(error);
  }
  next();
});

main.delete('*', skipPredefined, async (req, res, next) => {
  const { apiName, args } = req;
  const { response } = res.locals;

  try {
    const data = await deleteController(apiName, args);
    if (!data) {
      response.status = 404;
      response.addError('DELETE_UNSUCCESSFUL');
    } else {
      response.status = 204;
    }
  } catch (error) {
    next(error);
  }
  next();
});

// send responses depending on response variables
main.use((req, res, next) => {
  const { response } = res.locals;
  response.send(req, res);
});

// general error handler
main.use((err, req, res, next) => {
  const { response } = res.locals;

  // only print stack trace and return detailed error message in dev enviroment
  if (env === 'development') console.error(err);
  if (response.status === 200) response.status = 500;
  const error = process.env !== 'production' ? err.message : 'Internal server error.';
  response.addError(error);
  response.send(req, res);
});

module.exports = main;
