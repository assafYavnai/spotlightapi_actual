'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_check_topics_answer = sequelize.define('user_check_topics_answer', {
    user_check_topic_id: DataTypes.INTEGER,
    user_id: DataTypes.STRING,
    answer: DataTypes.STRING,
    choosen_option: DataTypes.STRING,
    taken_time: DataTypes.INTEGER,
    is_hilighted_answer: DataTypes.BOOLEAN
  }, {});
  user_check_topics_answer.associate = function(models) {
    // associations can be defined here
  };
  return user_check_topics_answer;
};