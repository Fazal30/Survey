const createError = require('http-errors');
const express = require('express');

const logger = require('./src/utils/logger');
const indexRouter = require('./src/routes/index');
const initMiddleware = require('./src/middlewares/init');

const app = express();

app.use(initMiddleware);

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404, 'Page not found.'));
});

// error handler
app.use((error, _req, res, _next) => {
  if (error instanceof createError.HttpError) {
    const obj = {
      message: error.message,
    };
    if (error.errors) {
      obj.errors = error.errors;
    }
    res.status(error.status).json(obj);
  } else {
    logger.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = app;
