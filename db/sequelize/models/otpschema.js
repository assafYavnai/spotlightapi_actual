'use strict';
module.exports = (sequelize, DataTypes) => {
  const OtpSchema = sequelize.define('OtpSchema', {
    email: DataTypes.STRING,
    otp: DataTypes.STRING
  }, {});
  OtpSchema.associate = function(models) {
    // associations can be defined here
  };
  return OtpSchema;
};