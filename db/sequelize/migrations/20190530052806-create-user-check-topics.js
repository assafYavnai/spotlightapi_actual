'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_check_topics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_check_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.TEXT
      },
      topic_category_id: {
        type: Sequelize.INTEGER
      },
      text_en: {
        type: Sequelize.STRING
      },
      text_he: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      analysis: {
        type: Sequelize.STRING
      },
      pro_score: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('user_check_topics');
  }
};