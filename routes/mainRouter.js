const express = require('express');

const devLogger = require('../lib/devLogger');
const apiIdentify = require('../lib/apiIdentify');
const pathExtractor = require('../lib/pathExtractor');
const validateRequest = require('../lib/validateRequest');

const getController = require('../controllers/getController');

const main = express.Router();

// request handling middleware
main.use(apiIdentify);
main.use(pathExtractor);

// temporary middleware to show request headers
main.use((req, res, next) => {
  devLogger(req.headers);
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
  const SUCCESS_STATUS = 200;
  const FAIL_STATUS = 404;

  const { apiName, args } = req;

  try {
    const data = await getController(apiName, args, next);
    if (!data) {
      res.locals.status = FAIL_STATUS;
      res.locals.error.push('No data found.');
    } else {
      res.locals.status = SUCCESS_STATUS;
      res.locals.data = data;
    }
  } catch (error) {
    next(error);
  }
  next();
});

main.post('*', (req, res) => {
  const SUCCESS_STATUS = 201;
  const FAIL_STATUS = 400;


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
