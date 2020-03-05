const express = require('express');
const morgan = require('morgan');

const devLogger = require('./lib/devLogger');
const subdomain = require('./lib/subdomain');
const internalRouter = require('./routes/internalRouter');
const externalRouter = require('./routes/externalRouter');

const store = require('./db/mongo');

store.init();

const env = process.env.NODE_ENV || 'development';

const app = express();

// security through obscurity \o/
app.disable('x-powered-by');

// logging middleware for dev environment
if (env === 'development') app.use(morgan('dev'));

app.use(express.json());

// invoke router for all internal API requests
app.use('/', subdomain(false, internalRouter));

// invoke router for all external API requests
app.use('/', subdomain(true, externalRouter));

// shut down gracefully on any uncaught runtime exceptions
process.on('uncaughtException', async (err) => {
  devLogger(err);
  await store.shutdown();
  process.exit(1);
});

// for now, also exit on any unhandled promise rejections, might need to
// research this a bit more
process.on('unhandledRejection', async (err) => {
  devLogger(err);
  await store.shutdown();
  process.exit(1);
});

module.exports = app;
