const uuid = require('uuid/dist/v4');

module.exports = (sequelize, DataTypes) => {
  const FormQuestion = sequelize.define(
    'FormQuestion',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuid.default,
        primaryKey: true,
      },
      formId: { type: DataTypes.UUID, allowNull: false },
      typeId: { type: DataTypes.UUID, allowNull: false },
      isRequired: DataTypes.BOOLEAN,
      question: DataTypes.STRING,
      hint: DataTypes.STRING,
    },
    {},
  );

  FormQuestion.associate = function (models) {
    FormQuestion.belongsTo(models.PrimitiveType, {
      as: 'type',
      foreignKey: 'typeId',
    });
  };

  FormQuestion.getListFields = () => [
    'id',
    'isRequired',
    'question',
    'hint',
    'formId',
    'typeId',
    'createdAt',
    'updatedAt',
  ];

  FormQuestion.getDisplayFields = () => [
    'id',
    'isRequired',
    'question',
    'hint',
    'formId',
    'typeId',
    'createdAt',
    'updatedAt',
  ];

  return FormQuestion;
};
