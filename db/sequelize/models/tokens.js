export default (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    kind: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accessToken: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: false,

    // classMethods: {
    //   associate(models) {
    //     Token.belongsTo(models, {
    //       foreignKey: 'userId'
    //     });
    //   }
    // }
  });

  return Token;
};
