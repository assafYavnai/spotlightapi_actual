'use strict';
module.exports = (sequelize, DataTypes) => {
  const topics_category_master = sequelize.define('topics_category_master', {
    name_en: DataTypes.STRING,
    description_en: DataTypes.STRING,
    name_he: DataTypes.STRING,
    description_he: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  topics_category_master.associate = function(models) {
    // associations can be defined here
  };
  return topics_category_master;
};