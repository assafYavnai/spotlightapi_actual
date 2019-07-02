'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_check_topics_answers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_check_topic_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.STRING
      },
      answer: {
        type: Sequelize.STRING
      },
      choosen_option: {
        type: Sequelize.STRING
      },
      taken_time: {
        type: Sequelize.INTEGER
      },
      is_hilighted_answer: {
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
    return queryInterface.dropTable('user_check_topics_answers');
  }
};