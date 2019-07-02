'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_groups = sequelize.define('user_groups', {
    user_id: DataTypes.INTEGER,
    group_name: DataTypes.STRING,
    created_on: DataTypes.DATE,
    updated_on: DataTypes.DATE
  }, {});
  user_groups.associate = function(models) {
    // associations can be defined here
  };
  return user_groups;
};