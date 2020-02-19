const express = require('express');

const devLogger = require('../lib/devLogger');
const apiIdentify = require('../lib/apiIdentify');
const pathExtractor = require('../lib/pathExtractor');
const validateRequest = require('../lib/validateRequest');

const getController = require('../controllers/getController');

const main = express.Router();

main.use(apiIdentify);
main.use(pathExtractor);
main.use(validateRequest);

// temporary middleware to show request headers
main.use((req, res, next) => {
  devLogger(req.headers);
  next();
});

main.get('*', async (req, res, next) => {
  const SUCCESS_STATUS = 200;
  const FAIL_STATUS = 404;

  const { apiName, args } = req;

  try {
    const data = await getController(apiName, args, next);
    if (!data) {
      res.status(FAIL_STATUS).json({ error: 'No data found.' });
    } else {
      res.status(SUCCESS_STATUS).json(data);
    }
  } catch (error) {
    next(error);
  }
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

module.exports = main;
