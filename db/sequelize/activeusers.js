import { Models, sequelize } from './models';
const { UserActiveLogsModel,User } = Models;
import Promise from 'bluebird';
import bcryptNode from 'bcrypt-nodejs';
const bcrypt = Promise.promisifyAll(bcryptNode);
var log4js = require('log4js');
const logger = log4js.getLogger('custom');

export function logActiveUserInfo(req) {
    try {
      console.log("call Active user log function");
      console.log(req);
      const obj={url:req.url, user_id: String(req.user_id)};
      UserActiveLogsModel.create(obj).then( (p)=>{
        console.log(p);
      }).catch( (err)=>{
        logger.error(err.stack);
        // res.status(500).send("Error");
      });
    } catch (error) {
      logger.error(error.stack);
      // res.status(500).send(error);
    }
}

export function removeLogActiveUserInfo(email) {
  try {
    console.log("call Remove Active user function");
    User.findOne({ where: { email } }).then((user) => {
      if(user!=null){
        UserActiveLogsModel.destroy({where:{user_id:user.id}}).then((result)=>{
          if (result > 0) {
            console.log(result);
          }
          }).catch((error)=>{
            return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});
          })
      }
    }).catch( (err)=>{
      logger.error(err.stack);
    });
  } catch (error) {
    logger.error(error.stack);
    // res.status(500).send(error);
  }
}
