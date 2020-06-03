'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_check_sharable = sequelize.define('user_check_sharable', {
   user_check_id: DataTypes.INTEGER,
    uniqe_id: DataTypes.STRING,
    is_accepted: DataTypes.BOOLEAN,
    is_completed: DataTypes.BOOLEAN,
    current_topic: DataTypes.INTEGER,
    current_time: DataTypes.INTEGER,
  }, {});
  user_check_sharable.associate = function(models) {
    // associations can be defined here
  };
  return user_check_sharable;
};