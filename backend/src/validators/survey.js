const { body, param } = require('express-validator');
const { id, response } = require('./index');

module.exports = {
  get: [id('formId', param, { errorMsg: 'Invalid Form.' })],
  addResponse: [
    id('formId', param, { errorMsg: 'Invalid Form.' }),
    response('response', body),
  ],
};
