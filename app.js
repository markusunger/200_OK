const express = require('express');
const morgan = require('morgan');

const config = require('./lib/config');
const devLogger = require('./lib/devLogger');
const mainRouter = require('./routes/mainRouter');

require('./db/mongo');

const env = process.env.NODE_ENV || 'development';

const app = express();

// logging middleware for dev environment
if (env === 'development') app.use(morgan('dev'));

// catch-all route for all requests
app.use('/', mainRouter);

// general error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  devLogger(err, 'error');
  res.status(500).end();
});

app.listen(config.nodePort, () => devLogger(`Server started on ${config.nodePort}.`));
