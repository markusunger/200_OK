const express = require('express');
const morgan = require('morgan');

const config = require('./lib/config');
const devLogger = require('./lib/devLogger');
const mainRouter = require('./routes/mainRouter');

const store = require('./db/mongo');

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
app.use((err, req, res, next) => {
  // only print stack trace in dev enviroment
  if (env === 'development') devLogger(err, 'error');
  if (res.statusCode === 200) res.status(500);
  const error = env === 'development' ? err.message : 'Internal server error.';
  res.json({ error });
});

// shut down gracefully on any uncaught runtime exceptions
process.on('uncaughtException', async (err) => {
  devLogger(err);
  await store.client.close();
  process.exit(1);
});

const port = config.nodePort || 3000;
app.listen(port, () => devLogger(`Server started on ${port}.`));
