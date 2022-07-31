const createError = require('http-errors');

const authenticate = () => {
  return (req, _res, next) => {
    try {
      if (!(req.user && req.user.id)) {
        return next(createError(401, 'Unauthorized access.'));
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = authenticate;
