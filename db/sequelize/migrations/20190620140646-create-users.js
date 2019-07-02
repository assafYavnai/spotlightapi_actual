'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'company_name',
     Sequelize.STRING
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'compnay_name'
    );
  }
};
