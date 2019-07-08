import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as config from '../constants';
import { Models, sequelize } from '../models';
import { tokenSecret } from '../constants';
import moment from 'moment';
import { throws } from 'assert';
const User = Models.User;
const OTPSchema = Models.OTPSchema;
import Promise from 'bluebird';
import bcryptNode from 'bcrypt-nodejs';
const bcrypt = Promise.promisifyAll(bcryptNode);
/**
 * POST /login
 */
export function login(req, res, next) {
  try{
  let token = null;
  // Do email and password validation for the server
  passport.authenticate('local', (authErr, user, info) => {
    if (authErr) return next(authErr);
    if (!user) {
      return res.sendStatus(401);
    }
    // Passport exposes a login() function on req (also aliased as
    // logIn()) that can be used to establish a login session
    return req.logIn(user, (loginErr) => {
      if (loginErr) return res.sendStatus(401);
          token = jwt.sign({ id: user.id }, tokenSecret, { expiresIn: 86400 });
          return res.status(200).send({ auth: true, email: user.email, name: user.first_name, company_name: user.company_name, access_token: token });
         // return res.sendStatus(200);
    });
  })(req, res, next);
}catch(error){
  return res.status(500).send(error);
}
}

/**
 * POST /logout
 */
export function logout(req, res) {
  try{
  req.logout();
  res.sendStatus(200);
  }catch(error){
    return res.status(500).send(error);
  }
}

/**
 * POST /signup
 * Create a new local account
 */
export function signUp(req, res, next) {
  try{
  let token = '';
  const {
user_name, email, password, name, last_name, is_active,
    secure_token, is_email_verified, phone_number, is_phone_verified,
    reset_password_token, reset_password_expires,
    isadmin, company_name
} = req.body;
    // find the user if exist then can not be signup..
  User.findOne({ where: { email } }).then((existingUser) => {
    if (existingUser) {
      return res.status(409).send({errorMessage: 'Sorry this user already exist'});
    }

    const user = User.build({
      // user_name:req.body.user_name,
      // email: req.body.email,
      // password: req.body.password
      user_name: email,
      email,
      password,
       first_name: name,
       company_name,
      // last_name:last_name,
      // is_active:is_active,
      // secure_token:secure_token,
      // is_email_verified:is_email_verified,
      // phone_number:phone_number,
      // is_phone_verified:is_phone_verified,
      // reset_password_token:reset_password_token,
      // reset_password_expires:reset_password_expires,
      isadmin: false,
      createdAt: new Date()

    });
    return user.save().then(() => {
      req.logIn(user, (err) => {
        if (err) return res.sendStatus(401);
          console.log(user);
          token = jwt.sign({ id: user.id }, tokenSecret, { expiresIn: 86400 });
         return res.status(200).send({ auth: true, email: user.email, name: user.first_name, company_name: user.company_name, access_token: token });
      });
    });
  }).catch(err => next(err));
}catch(error){
  return res.status(500).send(error);
}
}
/**
 * @api {get} /api/user/verifyotp OTP Verification
 * @apiName VerifyOTP
 * @apiGroup User
 * @apiParam {String} email require OTP to verify email.
 * @apiParam {String} otp require recent OTP sent on email.
 * @apiDescription This API is created to validate OTP sent on email address.
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 NotFound
 */
export function verifyOTP(req, res) {
  try {
    
    const dt = new Date();
    dt.setMinutes(dt.getMinutes() - 5);
    OTPSchema.findAndCount({
      where: {
        otp: req.body.otp,
        email: req.body.email,
        createdAt: {
          [sequelize.Op.lt]: sequelize.fn('NOW'),
          [sequelize.Op.gt]:  sequelize.literal("NOW() - interval '5 minute'")
        }
      }
    }).then((d) => {
      if (d.count > 0) {
        return res.status(200).send({successMessage: 'OTP confirmed', status: 200});
      }
      return res.status(404).send({errorMessage: 'Not Found', status: 404});
    }).catch((err) => {
      return res.status(404).send({errorMessage: 'Not Found', status: 404});
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: 'Unable to process request.Plese try again after some time', data: e
    });
  }
}

export function recoveryPasswordVerifyOTP(req, res) {
  try {
    const dt = new Date();
    dt.setMinutes(dt.getMinutes() - 5);
    OTPSchema.findAndCount({
      where: {
        otp: req.body.otp,
        email: req.body.email,
        createdAt: {
          [sequelize.Op.lt]: sequelize.fn('NOW'),
          [sequelize.Op.gt]:  sequelize.literal("NOW() - interval '5 minute'")
        }
      }
    }).then((d) => {
      if (d.count > 0) {
        return res.status(200).send({successMessage: 'OTP confirmed', status: 200});
      }
      return res.status(404).send({errorMessage: 'OTP not correct', status: 404});
    }).catch((err) => {
      return res.status(404).send({errorMessage: 'Not Found', status: 404});
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: 'Unable to process request.Plese try again after some time', data: e
    });
  }
}

export function changePassword(req, res) {
  try {
    
    const dt = new Date();
    const data = req.body;
    console.log('Get user API call');
        User.findOne({ where: { email:data.email }}).then((existingUser) => {
          if (existingUser) {
            //existingUser.set('passsword',data.password);
            bcrypt.genSaltAsync(5).then(salt =>
              bcrypt.hashAsync(data.password, salt, null).then((hash) => {
                data.password = hash;
                User.update(data,{where: {id:existingUser.id}}).then((uc) => {
                  console.log('response change password api');
                  console.log(uc);
                  return res.status(200).send({successMessage: 'Password has been changed', status: 200});
                }).catch((err) => {
                  return res.status(404).send({errorMessage: err.message, status: 404});
                });
            }));
          }
          else{
            return res.status(404).send({errorMessage: 'User not found', status: 404});
          }
        }).catch((err) => {
          return res.status(404).send({errorMessage: err.message, status: 404});
        });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: 'Unable to process request.Plese try again after some time', data: e
    });
  }
}

/**
 * @api {post} /api/user/validateToken Invite users.
 * @apiName ValidateToken
 * @apiGroup User
 * @apiHeader {String} x-access-token require latest acces token.
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Error
 *     HTTP/1.1 401 Error Access Denied
 */
export function validateToken(req, res) {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.tokenSecret, (e, decoded) => {
      if (e) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      else{
        return res.status(200).send({auth:true,message:'Token is valid'});
      }});
  } catch (error) {
    return res.status(500).send(error);
  }
}

export default {
  login,
  logout,
  signUp,
  verifyOTP,
  changePassword,
  recoveryPasswordVerifyOTP,
  validateToken
};
