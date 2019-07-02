'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.addColumn(
        'user_check_topics',
        'text_he',
       Sequelize.STRING
       
    );
      
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'text_he',
      
    );

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
