const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const addUser = require('./addUser');

const middleware = [
  cors(),
  helmet(),
  express.json({ limit: '20mb' }),
  express.urlencoded({ extended: false, limit: '20mb' }),
  addUser,
];

if (process.env.NODE_ENV !== 'test') middleware.push(morgan('dev'));

module.exports = middleware;
