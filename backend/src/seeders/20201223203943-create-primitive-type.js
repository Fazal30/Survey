const uuid = require('uuid/dist/v4');
const { types: primitiveTypes } = require('../utils/primitiveTypes');

module.exports = {
  up: (queryInterface, _Sequelize) => {
    const valuesToCreate = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const type of primitiveTypes) {
      valuesToCreate.push({
        ...type,
        id: uuid.default(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('PrimitiveTypes', valuesToCreate);
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('PrimitiveTypes', null, {});
  },
};
