'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_check_invitation = sequelize.define('user_check_invitation', {
   user_check_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    uniqe_id: DataTypes.STRING,
    is_accepted: DataTypes.BOOLEAN,
    is_completed: DataTypes.BOOLEAN,
    current_topic: DataTypes.INTEGER,
    current_time: DataTypes.INTEGER,
    invited_on: DataTypes.DATE
  }, {});
  user_check_invitation.associate = function(models) {
    // associations can be defined here
  };
  return user_check_invitation;
};