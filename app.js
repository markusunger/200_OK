const express = require('express');
const morgan = require('morgan');

const config = require('./lib/config');
const devLogger = require('./lib/devLogger');
const mainRouter = require('./routes/mainRouter');

require('./db/mongo');

const env = process.env.NODE_ENV || 'development';

const app = express();

// security through obscurity \o/
app.disable('x-powered-by');

// logging middleware for dev environment
if (env === 'development') app.use(morgan('dev'));

app.use(express.json());

// catch-all route for all requests
app.use('/', mainRouter);

// general error handler
// TBD: how any non-500 error is handled
app.use((err, req, res, next) => {
  // only print stack trace in dev enviroment
  if (env === 'development') devLogger(err, 'error');
  // TODO: maybe receive error codes through error object?
  if (res.statusCode === 200) res.status(500);
  const error = err.message || 'Internal server error.';
  res.json({ error });
});

app.listen(config.nodePort, () => devLogger(`Server started on ${config.nodePort}.`));
