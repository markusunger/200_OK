const express = require('express');

const devLogger = require('../lib/devLogger');
const apiIdentify = require('../lib/apiIdentify');
const pathExtractor = require('../lib/pathExtractor');
const validateRequest = require('../lib/validateRequest');

const getController = require('../controllers/getController');
const postController = require('../controllers/postController');

const main = express.Router();

// request handling middleware
main.use(apiIdentify);
main.use(pathExtractor);

// temporary middleware for debugging output
main.use((req, res, next) => {
  devLogger(req.args);
  next();
});

// prepare response
main.use((req, res, next) => {
  res.locals.errors = [];
  res.locals.status = 200;
  res.set({
    'Content-Type': 'application/json',
    Server: '200_OK API',
  });
  next();
});

// validates request and sends early error response if necessary
main.use(validateRequest);

/*
   --------------------
   HTTP method handlers
   --------------------
*/

main.get('*', async (req, res, next) => {
  const { apiName, args } = req;

  try {
    const data = await getController(apiName, args, next);
    if (!data) {
      res.locals.status = 404;
      res.locals.errors.push(`No data found for ${args.join('/')}.`);
    } else {
      res.locals.status = 200;
      res.locals.data = data;
    }
  } catch (error) {
    next(error);
  }
  next();
});

main.post('*', async (req, res, next) => {
  const { apiName, args, body } = req;

  try {
    const data = await postController(apiName, args, body, next);
    if (!data) {
      res.locals.status = 400;
      res.locals.errors.push('Data not successfully inserted.');
    } else {
      res.locals.status = 201;
      res.locals.data = data;
    }
  } catch (error) {
    next(error);
  }
  next();
});

main.put('*', (req, res) => {
  res.end();
});

main.delete('*', (req, res) => {
  res.end();
});

main.options('*', (req, res) => {
  res.end();
});

// send responses depending on res.locals variables
main.use((req, res, next) => {
  res.status(res.locals.status);
  if (res.locals.errors.length > 0) {
    res.json({ error: res.locals.errors });
  } else {
    res.json(res.locals.data);
  }
});

module.exports = main;
