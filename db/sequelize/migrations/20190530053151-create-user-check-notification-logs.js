'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_check_notification_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_check_id: {
        type: Sequelize.INTEGER
      },
      notification_event_code: {
        type: Sequelize.STRING
      },
      notification_text: {
        type: Sequelize.STRING
      },
      notified_on: {
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
    return queryInterface.dropTable('user_check_notification_logs');
  }
};