const uuid = require('uuid/dist/v4');

module.exports = (sequelize, DataTypes) => {
  const FormResponse = sequelize.define(
    'FormResponse',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuid.default,
        primaryKey: true,
      },
      formId: { type: DataTypes.UUID, allowNull: false },
    },
    {},
  );

  FormResponse.associate = function (models) {
    FormResponse.hasMany(models.FormQuestionResponse, {
      foreignKey: 'responseId',
      as: 'questions',
    });
  };

  FormResponse.getListFields = () => ['id', 'formId', 'createdAt', 'updatedAt'];

  return FormResponse;
};
