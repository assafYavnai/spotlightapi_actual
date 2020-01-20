import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as config from '../constants';
import { Models, sequelize } from '../models';
import { tokenSecret } from '../constants';
import {logActiveUserInfo} from '../activeusers';
import moment, { now } from 'moment';
import { throws } from 'assert';
// const User = Models.User;
 const subscribedUser=Models.subscriber;
// const UserLog = Models.UserLog;
// const OTPSchema = Models.OTPSchema;
const {
  User,UserLog,OTPSchema,UserCheck, UserCheckTopics,UserCheckInvitation,UserActiveLogsModel
  } = Models;
import Promise from 'bluebird';
import bcryptNode from 'bcrypt-nodejs';
const bcrypt = Promise.promisifyAll(bcryptNode);
var log4js = require('log4js');
const logger = log4js.getLogger('custom');
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
      var isSubscribed=false;
      if (loginErr) return res.sendStatus(401);
          token = jwt.sign({ id: user.id }, tokenSecret, { expiresIn: 86400 });
          let obj={url:"login",user_id:user.id};
          logActiveUserInfo(obj);
          User.update({last_login:new Date()},{ where: {email:user.email}}).then((u) => {
            if(u!=null && u[0]>0 ){
              subscribedUser.findOne({ where: { email:user.email } }).then((existingUser) => {
                if(existingUser){
                  isSubscribed=true;
                  console.log("Exist this Email");
                  return res.status(200).send({ auth: true, email: user.email, name: user.first_name, company_name: user.company_name, access_token: token,isSubscribedUser:isSubscribed });
                }
                
                return res.status(200).send({ auth: true, email: user.email, name: user.first_name, company_name: user.company_name, access_token: token,isSubscribedUser:isSubscribed,isadmin:user.isadmin });
              });    
            }
          })
          // return res.sendStatus(200);
    });
  })(req, res, next);
}catch(error){
  logger.error(error.stack);
  return res.status(500).send(error);
}
}

// admin Login
export function Adminlogin(req, res, next) {
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
      let obj={url:"login",user_id:user.id};
      logActiveUserInfo(obj);
          token = jwt.sign({ id: user.id }, tokenSecret, { expiresIn: 86400 });
           return res.status(200).send({ auth: true, email: user.email, name: user.first_name, company_name: user.company_name, access_token: token });
            
         // return res.sendStatus(200);
    });
  })(req, res, next);
}catch(error){
  logger.error(error.stack);
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
    logger.error(error.stack);
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
      return res.status(409).send({errorMessage: 'Sorry this user already exist',errorCode:'USER_ALREADY_EXISTS'});
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
          let obj={url:"signup",user_id:user.id};
          logActiveUserInfo(obj);
         return res.status(200).send({ auth: true, email: user.email, name: user.first_name, company_name: user.company_name, access_token: token });
      });
    });
  }).catch(err => next(err));
}catch(error){
  logger.error(error.stack);
  return res.status(500).send({errorMessage:error.message,errorCode:'UNEXPECTED'});
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
        return res.status(200).send({successMessage: 'OTP confirmed', status: 200,successCode:'CONFIRM_OTP'});
      }
      return res.status(404).send({errorMessage: 'Invalid code provided', status: 404,errorCode:'INVALID_OTP'});
    }).catch((err) => {
      logger.error(err.stack);
      return res.status(404).send({errorMessage: 'Invalid code provided', status: 404,errorCode:'INVALID_OTP'});
    });
  } catch (e) {
    logger.error(e.stack);
    console.log(e);
    res.status(500).send({errorMessage:e,errorCode:'UNEXPECTED',dt:new Date()});
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
      return res.status(404).send({errorMessage: 'Invalid code provided', status: 404,errorCode:'INVALID_OTP'});
    }).catch((err) => {
      logger.error(err.stack);
      return res.status(404).send({errorMessage: 'Invalid code provided', status: 404,errorCode:'INVALID_OTP'});
    });
  } catch (e) {
    console.log(e);
    logger.error(e.stack);
    res.status(500).send({errorMessage:e,errorCode:'UNEXPECTED',dt:new Date()});
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
            let obj={url:"Change Password",user_id:existingUser.id};
            logActiveUserInfo(obj);
            bcrypt.genSaltAsync(5).then(salt =>
              bcrypt.hashAsync(data.password, salt, null).then((hash) => {
                data.password = hash;
                User.update(data,{where: {id:existingUser.id}}).then((uc) => {
                   return res.status(200).send({successMessage: 'Password has been changed', status: 200});
                }).catch((err) => {
                  logger.error(err.stack);
                  return res.status(404).send({errorMessage: err.message, status: 404});
                });
            }));
          }
          else{
            return res.status(404).send({errorMessage: 'User not found', status: 404});
          }
        }).catch((err) => {
          logger.error(err.stack);
          return res.status(404).send({errorMessage: err.message, status: 404});
        });
  } catch (e) {
    console.log(e);
    logger.error(e.stack);
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
    console.log(req.session.passport);
    console.log(req.isAuthenticated());
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.',dt: new Date() });
    }

    jwt.verify(token, config.tokenSecret, (e, decoded) => {
      if (e) {
        return res.status(200).send({ auth: false, message: 'Failed to authenticate token.',dt: new Date() });
      }
      else{
        return res.status(200).send({auth:true,message:'Token is valid',dt: new Date()});
      }});
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send(error);
  }
}
 
export function logUserInfo(req, res) {
  try {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let data = req.body;
    console.log(data);
    const obj={browser_id:data.uid, data: JSON.stringify(data)};
    UserLog.create(obj).then( (p)=>{
      res.status(200).send("OK");
    }).catch( (err)=>{
      logger.error(err.stack);
      res.status(500).send("Error");
    });
  } catch (error) {
    logger.error(error.stack);
    res.status(500).send(error);
  }
}

function getUserList(req, res) {
  try{
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
  let topicList=[];
  jwt.verify(token, config.tokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    }
      let userid=decoded.id;
      let obj={url:"admin-dashboard",user_id:userid};
      logActiveUserInfo(obj);
      User.findAll({attributes: ['id', 'email','first_name','company_name','last_login'],
                order: [
                  ['id', 'DESC'],
              ]}).then((u)=>{
        UserCheck.findAll().then((uc)=>{
          const userData=u.map((tp)=>{
            let obj={};
            obj=tp.toJSON();
            const filterUserChecks=uc.filter((a)=>{
              return a.user_id==tp.id && a.end_date>now();
            });  
            if(filterUserChecks!=undefined && filterUserChecks!=null && filterUserChecks.length>0){
              obj.activecheck=filterUserChecks.length;
            }
            else{
              obj.activecheck=0;
            }
            topicList.push(obj)
          });

          return res.json(topicList);
        }) 
      }).catch((err) => {
        logger.error(err.stack);
        console.log(err);
        res.status(500).send({errorMessage:err,errorCode:'UNEXPECTED'});
      });
  });
 }catch(error){
   logger.error(error.stack);
   return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});
 }
}

function remove(req, res) {
  try {
    console.log("Call User delete API");
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      let userid=decoded.id;
      let obj={url:"admin-dashboard",user_id:userid};
      logActiveUserInfo(obj);
      UserCheck.findAll({where:{user_id:req.body.id.toString()}}).then((uc)=>{
        const checks = uc.map((p) => {
          return p.id;
        });
        console.log(checks);
        UserCheckInvitation.destroy({where: {
          user_check_id: {
            [sequelize.Op.in]: checks
          }
        }}).then((d)=>{
            console.log("Delete from user check invitation success");
            UserCheckTopics.destroy({where: {user_id:req.body.id.toString()}}).then((c)=>{
              console.log("Delete from user check topics success");
              UserCheck.destroy({where: {user_id:req.body.id.toString()}}).then((b)=>{
                console.log("Delete from user_checks success");
                  User.destroy({where: {id: req.body.id}}).then((a) => {
                    if (a > 0) {
                      console.log("Delete from users success");
                      return res.status(200).send({success: true});
                    }
                  });
              });
            });
        })
      });
    });
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send(error);
  }
}

function getUserByActiveChecks(req, res) {
  try{
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
  let topicList=[];
  jwt.verify(token, config.tokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    let userid=decoded.id;
      let obj={url:"admin-dashboard",user_id:userid};
      logActiveUserInfo(obj);
    sequelize.query(`SELECT tbl.activeCheck as activeCheck,tbl.created_at,u.id,u.email,u.first_name,u.company_name,u.last_login FROM users u inner join (SELECT user_id, sum(case when (current_timestamp between start_date and end_date) then 1 else 0 end) as activeCheck,max("createdAt")
    as created_at FROM user_checks group by user_id ) tbl on u.id =tbl.user_id::integer
    union
    select 0 as activeCheck,(u."createdAt") as created_at,u.id,u.email,u.first_name,u.company_name,u.last_login from users u where id not in (
    SELECT u.id FROM users u inner join (SELECT user_id, sum(case when (current_timestamp between start_date and end_date) then 1 else 0 end) as activeCheck,max("createdAt")
    as created_at FROM user_checks group by user_id ) tbl on u.id =tbl.user_id::integer
   )
    order by created_at desc,activeCheck desc`).then((users) => {
      return res.json(users[0]);
    }).catch((err) => {
      logger.error(err.stack);
      return res.status(500).send('Error while fetching comments');
    });
  });
 }catch(error){
   logger.error(error.stack);
   return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});
 }
}

function getUserByRecentlyCompleted(req, res) {
  try{
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
  let topicList=[];
  jwt.verify(token, config.tokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    let userid=decoded.id;
      let obj={url:"admin-dashboard",user_id:userid};
      logActiveUserInfo(obj);
    sequelize.query(`SELECT tbl.activeCheck as activeCheck,tbl.end_date,u.id,u.email,u.first_name,u.company_name,u.last_login FROM users u inner join (select user_id, sum(case when (current_timestamp between start_date and end_date) then 1 else 0 end) as activeCheck,max("end_date")
    as end_date from  (select * from user_checks where id in (select user_check_id from (select  sum(CASE WHEN is_completed =true then 1 else 0 end)/count(id) as completed,user_check_id  from user_check_invitations 
   where user_check_id is not null group by user_check_id) tbl where completed=1)
   union
   select * from user_checks where id not in (select user_check_id from (select  sum(CASE WHEN is_completed =true then 1 else 0 end)/count(id) as completed,user_check_id  from user_check_invitations 
   where user_check_id is not null group by user_check_id) tbl where completed=1) and end_date < current_timestamp) tbl2 group by user_id) tbl on u.id =tbl.user_id::integer
   union 
   select 0 as activeCheck,(u."createdAt") as end_date,u.id,u.email,u.first_name,u.company_name,u.last_login from users u where id not in (
    SELECT u.id FROM users u inner join (select user_id, sum(case when (current_timestamp between start_date and end_date) then 1 else 0 end) as activeCheck,max("end_date")
    as end_date from  (select * from user_checks where id in (select user_check_id from (select  sum(CASE WHEN is_completed =true then 1 else 0 end)/count(id) as completed,user_check_id  from user_check_invitations 
    where user_check_id is not null group by user_check_id) tbl where completed=1)
    union
    select * from user_checks where id not in (select user_check_id from (select  sum(CASE WHEN is_completed =true then 1 else 0 end)/count(id) as completed,user_check_id  from user_check_invitations 
    where user_check_id is not null group by user_check_id) tbl where completed=1) and end_date < current_timestamp) tbl2 group by user_id) tbl on u.id =tbl.user_id::integer
    order by tbl.end_date desc,tbl.activeCheck desc
   )
   order by end_date desc,activeCheck desc `).then((users) => {
      return res.json(users[0]);
    }).catch((err) => {
      logger.error(err.stack);
      return res.status(500).send('Error while fetching comments');
    });
  });
 }catch(error){
   logger.error(error.stack);
   return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});
 }
}

function getCurrentlyActiveUsers(req, res){
  try{
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
  let topicList=[];
  jwt.verify(token, config.tokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    let userid=decoded.id;
      let obj={url:"admin-dashboard",user_id:userid};
      logActiveUserInfo(obj);
    sequelize.query(`select user_id from user_active_logs where "createdAt" >= NOW() - INTERVAL '10 minutes' group by user_id; `).then((users) => {
      let user={activeUsers:users[0].length};
      return res.json(user);
    }).catch((err) => {
      logger.error(err.stack);
      return res.status(500).send('Error while fetching comments');
    });
  });
 }catch(error){
   logger.error(error.stack);
   return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});
 }
}

export default {
  login,
  logout,
  signUp,
  verifyOTP,
  changePassword,
  recoveryPasswordVerifyOTP,
  validateToken,
  logUserInfo,
  Adminlogin,
  getUserList,
  remove,
  getUserByActiveChecks,
  getUserByRecentlyCompleted,
  getCurrentlyActiveUsers
};
