'use strict';
module.exports = (sequelize, DataTypes) => {
  const report_sharable_link = sequelize.define('report_sharable_link', {
    user_check_id: DataTypes.INTEGER,
    tiny_url: DataTypes.STRING
  }, {});
  report_sharable_link.associate = function(models) {
    // associations can be defined here
  };
  return report_sharable_link;
};