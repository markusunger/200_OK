const express = require('express');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const Response = require('../lib/response');

const apiLookup = require('../middleware/apiLookup');
const pathExtractor = require('../middleware/pathExtractor');
const validateRequest = require('../middleware/validateRequest');
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

// set up custom response objects
main.use((req, res, next) => {
  res.locals.response = new Response();
  next();
});

// rate limiting first to send 429 without any database lookups
// when too many requests were sent
main.use(async (req, res, next) => {
  const { hostname } = req;
  const { response } = res.locals;
  try {
    await rateLimiter.consume(hostname, 1);
    next();
  } catch (err) {
    // TODO: does this still need CORS headers to be successfully forwarded by a browser?
    response.status = 429;
    next(new Error('Too many requests. Better slow down.'));
  }
});

// request handling middleware
main.use(apiLookup);
main.use(pathExtractor);

// temporary middleware for debugging
main.use((req, res, next) => {
  // debug stuff here
  next();
});

// validates request and sends early error response if invalid request
main.use(validateRequest);

// CORS support and general OPTIONS request responses
main.use(cors());

/*
   --------------------
   HTTP method handlers
   --------------------
*/

main.get('*', async (req, res, next) => {
  const { apiName, args } = req;
  const { response } = res.locals;

  try {
    const data = await getController(apiName, args, next);
    if (!data) {
      response.status = 404;
      response.addError(`No data found for ${args.join('/')}.`);
    } else {
      response.status = 200;
      response.body = data;
    }
  } catch (error) {
    next(error);
  }
  next();
});

main.post('*', async (req, res, next) => {
  const { apiName, args, body } = req;
  const { response } = res.locals;

  try {
    const data = await postController(apiName, args, body, next);
    if (!data) {
      response.status = 400;
      response.addError('Data could not be inserted.');
    } else {
      response.status = 201;
      response.body = data;
    }
  } catch (error) {
    next(error);
  }
  next();
});

main.put('*', async (req, res, next) => {
  const { apiName, args, body } = req;
  const { response } = res.locals;

  try {
    const data = await putController(apiName, args, body, next);
    if (!data) {
      response.status = 400;
      response.addError('Data could not be updated (most likely because the item doesn\'t exist).');
    } else {
      response.status = 204;
    }
  } catch (error) {
    next(error);
  }
  next();
});

main.delete('*', async (req, res, next) => {
  const { apiName, args } = req;
  const { response } = res.locals;

  try {
    const data = await deleteController(apiName, args, next);
    if (!data) {
      response.status = 404;
      response.addError('Data could not be deleted (because it likely isn\'t there).');
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

  res.set(response.getHeaders());

  res.status(response.status);
  if (response.hasErrors()) {
    res.json({ error: response.errors });
  } else if (response.body) {
    res.json(response.body);
  } else {
    res.end();
  }
});

// general error handler
main.use((err, req, res, next) => {
  const { response } = res.locals;

  // only print stack trace and return detailed error message in dev enviroment
  if (env === 'development') console.log(err);
  if (response.status === 200) response.status = 500;
  const error = process.env !== 'production' ? err.message : 'Internal server error.';
  response.addError(error);
  res.status(response.status).json({ error: response.errors });
});

module.exports = main;
