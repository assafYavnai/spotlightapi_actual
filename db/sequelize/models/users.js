import Promise from 'bluebird';
import bcryptNode from 'bcrypt-nodejs';

const bcrypt = Promise.promisifyAll(bcryptNode);

// Other oauthtypes to be added

/* eslint-disable no-param-reassign */
function hashPassword(user) {
  if (!user.changed('password')) return null;
  return bcrypt.genSaltAsync(5).then(salt =>
    bcrypt.hashAsync(user.password, salt, null).then((hash) => {
      user.password = hash;
    })
  );
}
/* eslint-enable no-param-reassign */

export default (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    user_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    secure_token: DataTypes.STRING,
    is_email_verified: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    is_phone_verified: DataTypes.STRING,
    created_on: DataTypes.DATE,
    updated_on: DataTypes.DATE,
    reset_password_token: DataTypes.STRING,
    reset_password_expires: DataTypes.DATE,
    isadmin: DataTypes.BOOLEAN,
    company_name: DataTypes.STRING
  }, {
  });

  User.beforeCreate(hashPassword);
  User.beforeUpdate(hashPassword);
  User.prototype.comparePassword = function (candidatePassword) {
    return bcrypt.compareAsync(candidatePassword, this.password);
  };
  // User.prototype.toJSON = function () {
  //     return {
  //       id: this.id,
  //       email: this.email,
  //       profile: {
  //         name: this.name,
  //         gender: this.gender,
  //         location: this.location,
  //         website: this.website,
  //         picture: this.picture
  //       }
  //     };
  // };
  return User;
};
