'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_check_notification_logs = sequelize.define('user_check_notification_logs', {
    user_check_id: DataTypes.INTEGER,
    notification_event_code: DataTypes.STRING,
    notification_text: DataTypes.STRING,
    notified_on: DataTypes.DATE
  }, {});
  user_check_notification_logs.associate = function(models) {
    // associations can be defined here
  };
  return user_check_notification_logs;
};