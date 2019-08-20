import { Models } from '../models';
var log4js = require('log4js');
const logger = log4js.getLogger('custom');
// eslint-disable-next-line prefer-destructuring
const User = Models.User;

export default (email, password, done) => User.findOne({ where: { email } }).then((user) => {
    if (!user) {
        return done(null, false, { message: `There is no record of the email ${email}.` });
      }
    return user.comparePassword(password).then((result) => {
      console.log(result);
        if (result) done(null, user);
        else done(null, false, { message: 'Your email/password combination is incorrect.' });
    });
  }).catch((err) => {
    console.log(err);
    logger.error(err.stack);
    done(null, false, { message: 'Something went wrong trying to authenticate' });
  });
