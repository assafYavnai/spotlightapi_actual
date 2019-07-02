'use strict';
module.exports = (sequelize, DataTypes) => {
  const checks_master = sequelize.define('checks_master', {
    check_code: DataTypes.STRING,
    description: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    is_pro: DataTypes.BOOLEAN,
    price: DataTypes.NUMERIC
  }, {});
  checks_master.associate = function(models) {
    // associations can be defined here
  };
  return checks_master;
};