'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_check_topics = sequelize.define('user_check_topics', {
    user_check_id: DataTypes.INTEGER,
    user_id: DataTypes.TEXT,
    topic_category_id: DataTypes.INTEGER,
    text_en: DataTypes.STRING,
    text_he: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    analysis: DataTypes.STRING,
    pro_score: DataTypes.INTEGER,
    estimated_time: DataTypes.INTEGER
  }, {});
  user_check_topics.associate = function(models) {
    // associations can be defined here
  };
  return user_check_topics;
};