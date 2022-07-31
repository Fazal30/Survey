const bcryptjs = require('bcryptjs');
const uuid = require('uuid/dist/v4');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuid.default,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {},
  );

  User.associate = function (_models) {
    // associations can be defined here
  };

  const encryptPassword = async (user) => {
    if (user.changed('password')) {
      const salt = await bcryptjs.genSalt(12);
      const hashPassword = await bcryptjs.hash(user.password, salt);

      // eslint-disable-next-line no-param-reassign
      user.password = hashPassword;
    }
    return user;
  };

  async function checkPassword(password) {
    const isMatch = await bcryptjs.compare(password, this.password);
    return isMatch;
  }

  User.beforeCreate(async (user) => {
    const encryptedUser = await encryptPassword(user);
    return encryptedUser;
  });

  User.beforeUpdate(encryptPassword);

  User.prototype.checkPassword = checkPassword;

  User.getProfileFields = () => [
    'id',
    'name',
    'email',
    'createdAt',
    'updatedAt',
  ];

  return User;
};
