'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_groups_email = sequelize.define('user_groups_email', {
    group_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    created_on: DataTypes.DATE,
    updated_on: DataTypes.DATE
  }, {});
  user_groups_email.associate = function(models) {
    // associations can be defined here
  };
  return user_groups_email;
};