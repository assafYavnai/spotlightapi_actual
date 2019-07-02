'use strict';
module.exports = (sequelize, DataTypes) => {
  const payments = sequelize.define('payments', {
    user_id: DataTypes.INTEGER,
    user_check_id: DataTypes.INTEGER,
    amount: DataTypes.NUMERIC,
    transaction_id: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  payments.associate = function(models) {
    // associations can be defined here
  };
  return payments;
};