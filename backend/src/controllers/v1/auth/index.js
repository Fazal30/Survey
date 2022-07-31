const createError = require('http-errors');
const { UniqueConstraintError } = require('sequelize');

const { User } = require('../../../models');
const create = require('../../create');
const { signup, login } = require('../../../validators/auth');
const { sign } = require('../../../utils/jwt');

module.exports = {
  signup: create(
    async (_req, res) => {
      try {
        const { inputBody } = res.locals;
        const user = await User.create(inputBody);
        const token = await sign(user.id);

        const userData = user.dataValues;
        delete userData.password;

        return res.json({
          message: 'User added successfully.',
          user: userData,
          token,
        });
      } catch (error) {
        if (error instanceof UniqueConstraintError) {
          throw createError(409, 'This email id is already in use.', {
            errors: {
              email: 'This email id is already in use.',
            },
          });
        }

        throw error;
      }
    },
    {
      validation: {
        validators: signup,
        throwError: true,
      },
      inputs: ['name', 'email', 'password'],
    },
  ),

  login: create(
    async (_req, res) => {
      const { inputBody } = res.locals;
      const user = await User.findOne({ where: { email: inputBody.email } });

      if (!user) {
        throw createError(401, 'Invalid email or password');
      }

      if (!(await user.checkPassword(inputBody.password))) {
        throw createError(401, 'Invalid email or password');
      }

      const token = await sign(user.id);

      const userData = user.dataValues;
      delete userData.password;

      return res.json({
        user: userData,
        token,
      });
    },
    {
      validation: {
        validators: login,
        throwError: true,
      },
      inputs: ['email', 'password'],
    },
  ),
};
