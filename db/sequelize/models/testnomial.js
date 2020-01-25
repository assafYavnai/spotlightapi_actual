'use strict';
module.exports = (sequelize, DataTypes) => {
  const testnomial = sequelize.define('testnomials', {
    company_name: DataTypes.STRING,
    recommande_name: DataTypes.STRING,
    recommande_title:DataTypes.STRING,
    testnomial_en:DataTypes.STRING,
    testnomial_he:DataTypes.STRING,
    is_testnomial:DataTypes.BOOLEAN,
    image:DataTypes.STRING
  }, {});
  testnomial.associate = function(models) {
    // associations can be defined here
  };
  return testnomial;
};