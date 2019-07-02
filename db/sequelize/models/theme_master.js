'use strict';
module.exports = (sequelize, DataTypes) => {
  const theme_master = sequelize.define('theme_master', {
    category_id: DataTypes.INTEGER,
    name_en: DataTypes.STRING,
    description_en: DataTypes.STRING,
    name_he: DataTypes.STRING,
    description_he: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  theme_master.associate = function(models) {
    // associations can be defined here
  };
  return theme_master;
};