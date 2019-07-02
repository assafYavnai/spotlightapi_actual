//'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      secure_token: {
        type: Sequelize.STRING
      },
      is_email_verified: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      is_phone_verified: {
        type: Sequelize.STRING
      },
      created_on: {
        type: Sequelize.DATE
      },
      updated_on: {
        type: Sequelize.DATE
      },
      reset_password_token: {
        type: Sequelize.STRING
      },
      reset_password_expires: {
        type: Sequelize.DATE
      },
      isadmin: {
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
    return queryInterface.dropTable('users');
  }
};