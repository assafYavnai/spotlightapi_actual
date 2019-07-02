//'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('checks_masters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      check_code: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      is_pro: {
        type: Sequelize.BOOLEAN
      },
      price: {
        type: Sequelize.NUMERIC
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('checks_masters');
  }
};