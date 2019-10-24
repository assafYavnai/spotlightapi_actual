'use strict';
module.exports = (sequelize, DataTypes) => {
  const subscriber = sequelize.define('subscriber', {
    email: DataTypes.STRING
  }, {});
  subscriber.associate = function(models) {
    // associations can be defined here
  };
  return subscriber;
};