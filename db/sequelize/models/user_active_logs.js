'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_active_logs = sequelize.define('user_active_logs', {
    url: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  user_active_logs.associate = function(models) {
    // associations can be defined here
  };
  return user_active_logs;
};