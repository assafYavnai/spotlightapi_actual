'use strict';
module.exports = (sequelize, DataTypes) => {
  const cms_pages = sequelize.define('cms_pages', {
    title_en: DataTypes.STRING,
    title_he: DataTypes.STRING,
    content_en: DataTypes.STRING,
    content_he: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {});
  cms_pages.associate = function(models) {
    // associations can be defined here
  };
  return cms_pages;
};