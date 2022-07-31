const jwt = require('../utils/jwt');
const { User } = require('../models/index');

module.exports = async (req, res, next) => {
  try {
    const header = req.get('Authorization');
    if (header) {
      const splitedHeader = header.split(' ');
      let token;
      if (splitedHeader.length === 2) {
        // eslint-disable-next-line prefer-destructuring
        token = splitedHeader[1];
      }

      const payload = await jwt.verify(token);
      if (payload) {
        const user = await User.findOne({
          where: { id: payload.sub },
          attributes: ['id'],
        });
        if (user) {
          req.userPayload = payload;
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};
