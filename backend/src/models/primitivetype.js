const uuid = require('uuid/dist/v4');

module.exports = (sequelize, DataTypes) => {
  const PrimitiveType = sequelize.define(
    'PrimitiveType',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuid.default,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {},
  );
  PrimitiveType.associate = function (_models) {
    // associations can be defined here
  };

  PrimitiveType.getListFields = () => [
    'id',
    'name',
    'description',
    'type',
    'createdAt',
    'updatedAt',
  ];

  PrimitiveType.getDisplayFields = () => ['id', 'name', 'description', 'type'];

  return PrimitiveType;
};
