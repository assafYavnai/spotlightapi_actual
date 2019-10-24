import _ from 'lodash';
import jwt from 'jsonwebtoken';
import Axios from 'axios';
import { Models, sequelize } from '../models';
import * as config from '../constants';
import { privateLocalAddress,hostName } from '../../../config/app';
var log4js = require('log4js');
const logger = log4js.getLogger('custom'); 

const Subscribe = Models.subscriber;

/**
 * List
 */

/**
 * Add a Topic
 */
export function add(req, res){
    
  try{
    const{email,language,subject}=req.body;
    //console.log("Kya A rha hai:"+req.body.email);
    Subscribe.findOne({ where: { email } }).then((existingUser) => {
        if (existingUser) {
          return res.status(409).send({errorMessage: 'Sorry this Email already Subscribed',errorCode:'USER_ALREADY_SUBSCRIBED'});
        }else{
        Subscribe.create({email:email}).then(() => {
          Axios.post(privateLocalAddress+'/api/userSubscription', {email:email,language:language,subject:subject}).then((response)=>{
            console.log('Sent Subscription email');
           
          }).catch((err) => {
            logger.error(err.stack);
            console.log('Error in sending Email');
           
          });
            res.status(200).send({message:'Successfully Subscribed',status:200,successCode:"SUBSCRIBE_SUCCESS"});
          
        }).catch((err) => {
            console.log(err);
            logger.error(err.stack);
            return res.status(500).send({errorMessage:error.message,errorCode:'UNEXPECTED'});
     })
    }
});
}catch(error){
  logger.error(error.stack);
  return res.status(500).send(error);
}
}


export default {
  add
};
