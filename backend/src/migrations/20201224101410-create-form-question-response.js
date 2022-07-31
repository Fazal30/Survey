module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FormQuestionResponses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      questionId: {
        type: Sequelize.UUID,
        references: {
          model: 'FormQuestions',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
      },
      responseId: {
        type: Sequelize.UUID,
        references: {
          model: 'FormResponses',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
      },
      response: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.dropTable('FormQuestionResponses');
  },
};
