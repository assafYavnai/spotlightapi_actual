'use strict';
module.exports = (sequelize, DataTypes) => {
  const pro_enquiry = sequelize.define('pro_enquiry', {
    full_name: DataTypes.STRING,
    organization: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    request_id: DataTypes.INTEGER
  }, {});
  pro_enquiry.associate = function(models) {
    // associations can be defined here
  };
  return pro_enquiry;
};