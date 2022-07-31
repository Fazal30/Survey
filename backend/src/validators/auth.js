const { body } = require('express-validator');
const { name, email, password, string } = require('./index');

module.exports = {
  signup: [
    name('name', body),
    email('email', body),
    password('password', body),
  ],

  login: [
    email('email', body),
    string('password', body, { displayName: 'Password' }),
  ],
};
