const express = require('express');

const devLogger = require('../libs/devLogger');
const apiIdentify = require('../libs/apiIdentify');
const pathExtractor = require('../libs/pathExtractor');

const main = express.Router();

main.use(apiIdentify);
main.use(pathExtractor);

main.get('*', (req, res) => {
  devLogger(`GET Request to ${req.path}`);
  res.end();
});

main.post('*', (req, res) => {
  devLogger(`POST Request to ${req.path}`);
  res.end();
});

main.put('*', (req, res) => {
  devLogger(`PUT Request to ${req.path}`);
  res.end();
});

main.delete('*', (req, res) => {
  devLogger(`DELETE Request to ${req.path}`);
  res.end();
});

main.options('*', (req, res) => {
  devLogger(`OPTIONS Request to ${req.path}`);
  res.end();
});

module.exports = main;
