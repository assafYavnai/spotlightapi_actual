'use strict';
module.exports = (sequelize, DataTypes) => {
  const core_check_focal_points = sequelize.define('core_check_focal_points', {
    user_check_id: DataTypes.INTEGER,
    focal_details: DataTypes.STRING,
    focal_type: DataTypes.STRING
  }, {});
  core_check_focal_points.associate = function(models) {
    // associations can be defined here
  };
  return core_check_focal_points;
};