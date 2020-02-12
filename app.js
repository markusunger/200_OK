const express = require('express');
const morgan = require('morgan');

const devLogger = require('./libs/devLogger');
const mainRouter = require('./routes/mainRouter');

require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const app = express();

// logging middleware for dev environment
if (env === 'development') app.use(morgan('dev'));

// catch-all route for all requests
app.use('/', mainRouter);

// general error handler
app.use((err, req, res, next) => {
  devLogger(err, 'error');
  res.status(500).end();
});

app.listen(process.env.NODE_PORT, () => devLogger(`Server started on ${process.env.NODE_PORT}.`));
