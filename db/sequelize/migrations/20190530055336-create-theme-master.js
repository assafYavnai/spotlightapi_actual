'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('theme_masters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_id: {
        type: Sequelize.INTEGER
      },
      name_en: {
        type: Sequelize.STRING
      },
      description_en: {
        type: Sequelize.STRING
      },
      name_he: {
        type: Sequelize.STRING
      },
      description_he: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('theme_masters');
  }
};