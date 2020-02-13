const express = require('express');

const devLogger = require('../lib/devLogger');
const apiIdentify = require('../lib/apiIdentify');
const pathExtractor = require('../lib/pathExtractor');

const main = express.Router();

main.use(apiIdentify);
main.use(pathExtractor);

main.get('*', (req, res) => {
  res.end();
});

main.post('*', (req, res) => {
  res.end();
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
