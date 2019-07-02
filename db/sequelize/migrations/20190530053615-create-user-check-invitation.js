'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_check_invitations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_check_invitation: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      uniqe_id: {
        type: Sequelize.STRING
      },
      is_accepted: {
        type: Sequelize.BOOLEAN
      },
      is_completed: {
        type: Sequelize.BOOLEAN
      },
      current_topic: {
        type: Sequelize.INTEGER
      },
      invited_on: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('user_check_invitations');
  }
};