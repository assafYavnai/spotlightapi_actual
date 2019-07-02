'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_checks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.STRING
      },
      check_master_code: {
        type: Sequelize.STRING
      },
      theme_id: {
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
      payment_completed: {
        type: Sequelize.BOOLEAN
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      tiny_url: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      created_on: {
        type: Sequelize.DATE
      },
      updated_on: {
        type: Sequelize.DATE
      },
      conclusion: {
        type: Sequelize.STRING
      },
      is_pro_report_ready: {
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
    return queryInterface.dropTable('user_checks');
  }
};