const uuid = require('uuid/dist/v4');

module.exports = (sequelize, DataTypes) => {
  const Form = sequelize.define(
    'Form',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuid.default,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      userId: { type: DataTypes.UUID, allowNull: false },
      isActive: DataTypes.BOOLEAN,
    },
    {},
  );
  Form.associate = function (_models) {
    // associations can be defined here
  };

  Form.getListFields = () => [
    'id',
    'title',
    'description',
    'isActive',
    'createdAt',
    'updatedAt',
  ];

  Form.getDisplayFields = () => [
    'id',
    'title',
    'description',
    'isActive',
    'createdAt',
    'updatedAt',
  ];

  return Form;
};
