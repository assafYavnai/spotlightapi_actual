'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'user_check_topics',
      'estimated_time',
     Sequelize.INTEGER
    );
  },

  down: (queryInterface, Sequelize) => {
    
     return queryInterface.removeColumn(
      'user_check_topics',
      'estimated_time'
    );
  }
};
