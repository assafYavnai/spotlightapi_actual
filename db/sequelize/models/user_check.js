'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_check = sequelize.define('user_check', {
    user_id: DataTypes.STRING,
    check_master_code: DataTypes.STRING,
    theme_id: DataTypes.INTEGER,
    name_en: DataTypes.STRING,
    description_en: DataTypes.STRING,
    name_he: DataTypes.STRING,
    description_he: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    payment_completed: DataTypes.BOOLEAN,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    tiny_url: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    created_on: DataTypes.DATE,
    updated_on: DataTypes.DATE,
    conclusion: DataTypes.STRING,
    is_pro_report_ready: DataTypes.BOOLEAN
  }, {});
  user_check.associate = function(models) {
    // associations can be defined here
  };
  return user_check;
};