'use strict';
module.exports = (sequelize, DataTypes) => {
  const topics_master = sequelize.define('topics_master', {
    theme_id: DataTypes.INTEGER,
    topic_category_id: DataTypes.INTEGER,
    name_en: DataTypes.STRING,
    description_en: DataTypes.STRING,
    name_he: DataTypes.STRING,
    description_he: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    estimated_time: DataTypes.INTEGER,
    sequence:DataTypes.INTEGER,
    child_category_id: DataTypes.INTEGER,
    check_type:DataTypes.STRING
  }, {});
  topics_master.associate = function(models) {
    // associations can be defined here
  };
  return topics_master;
};