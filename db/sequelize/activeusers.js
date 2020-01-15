import { Models, sequelize } from './models';
const { UserActiveLogsModel } = Models;
import Promise from 'bluebird';
import bcryptNode from 'bcrypt-nodejs';
const bcrypt = Promise.promisifyAll(bcryptNode);
var log4js = require('log4js');
const logger = log4js.getLogger('custom');

export function logActiveUserInfo(req) {
    try {
      console.log("call Active user log function");
      console.log(req);
      const obj={url:req.url, user_id: req.user_id};
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
