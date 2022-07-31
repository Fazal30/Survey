/* eslint-disable no-async-promise-executor */
const jwt = require('jsonwebtoken');

const config = require('../config');

module.exports = {
  sign: async (userId) => {
    const payload = { sub: userId };
    const token = jwt.sign(payload, config.JWT.SECRET, {
      expiresIn: config.JWT.EXPIRES_IN,
    });
    return token;
  },

  verify: async (token) => {
    const payload = jwt.verify(token, config.JWT.SECRET);
    return payload;
  },
};
