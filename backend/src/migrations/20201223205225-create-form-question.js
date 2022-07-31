module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FormQuestions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      formId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      typeId: {
        type: Sequelize.UUID,
        references: {
          model: 'PrimitiveTypes',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
      },
      isRequired: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      question: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      hint: {
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
    return queryInterface.dropTable('FormQuestions');
  },
};
