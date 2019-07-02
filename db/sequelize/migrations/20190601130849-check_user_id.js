'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'user_check_invitations',
      'user_check_id',
     Sequelize.STRING
     
  );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'user_check_invitations',
      'user_check_invitation'
      
    );
  }
};
