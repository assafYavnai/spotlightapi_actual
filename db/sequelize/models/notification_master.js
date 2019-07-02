'use strict';
module.exports = (sequelize, DataTypes) => {
  const notification_master = sequelize.define('notification_master', {
    name_en: DataTypes.STRING,
    name_he: DataTypes.STRING,
    notification_code: DataTypes.STRING
  }, {});
  notification_master.associate = function(models) {
    // associations can be defined here
  };
  return notification_master;
};