module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FormResponses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      formId: {
        type: Sequelize.UUID,
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
    return queryInterface.dropTable('FormResponses');
  },
};
