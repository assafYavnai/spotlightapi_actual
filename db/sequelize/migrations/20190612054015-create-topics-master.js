'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'topics_masters',
      'estimated_time',
     Sequelize.INTEGER
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'topics_masters',
      'estimated_time'
    );
  }
};
