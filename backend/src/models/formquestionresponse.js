const uuid = require('uuid/dist/v4');

module.exports = (sequelize, DataTypes) => {
  const FormQuestionResponse = sequelize.define(
    'FormQuestionResponse',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuid.default,
        primaryKey: true,
      },
      questionId: { type: DataTypes.UUID, allowNull: false },
      responseId: { type: DataTypes.UUID, allowNull: false },
      response: DataTypes.STRING,
    },
    {},
  );
  FormQuestionResponse.associate = function (_models) {
    // associations can be defined here
  };

  FormQuestionResponse.getListFields = () => [
    'id',
    'questionId',
    'response',
    'createdAt',
  ];

  return FormQuestionResponse;
};
