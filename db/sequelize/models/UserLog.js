'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_log = sequelize.define('user_log', {
    browser_id: DataTypes.STRING,
    data: DataTypes.STRING
  }, {});
  user_log.associate = function(models) {
    // associations can be defined here
  };
  return user_log;
};