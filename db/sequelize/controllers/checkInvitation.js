import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { Models, sequelize } from '../models';
import * as config from '../constants';
import {privateLocalAddress, hostName} from '../../../config/app';
import {logActiveUserInfo} from '../activeusers';
import Axios from 'axios';
import * as utils from '../../../utils/common';
import checkApplication from './checkApplication';
const uuidv4 = require('uuid/v4');
var log4js = require('log4js');
const logger = log4js.getLogger('custom'); 

const UserCheckInvitation = Models.UserCheckInvitation;
const UserCheckMaster = Models.UserCheck;

/**
 * @api {post} /api/check/inviteusers Invite users.
 * @apiName InviteUsers
 * @apiGroup Check
 * @apiHeader {String} x-access-token require latest acces token.
 * @apiParam {String} emails All all emails comma saperated.
 * @apiParam {String} content Content which need to send for inviting users.
 * @apiParam {String} tiny_url Urls for check Application.
 * @apiParam {Number} check_id Id of check for which user is going to invite.
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Error
 */
 export function sendInvitation(req, res) {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.tokenSecret, (e, decoded) => {
      if (e) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      let obj={url:"send invitation",user_id:decoded.id};
      logActiveUserInfo(obj);
      const { emails, check_id, customMessage,checkName,firstName,lastName,participant,dueDate,language,subject } = req.body;
      const data = [];
      const emailsParced = emails.replace(/ /g,'');
      UserCheckMaster.findById(check_id).then((check) =>{
        emailsParced.split(',').forEach((item) => {
          // insert this email into invitation table.
          const uniqId = uuidv4();
         data.push({
                user_check_id: check_id,
                email: item,
                uniqe_id: uniqId,
                is_accepted: false,
                is_completed: false,
                current_topic: 0,
                invited_on: new Date()
              });
        });
        if (data.length > 0) {
          UserCheckInvitation.findAll({where: { email: emailsParced.split(','),user_check_id: check_id }}).then(c=>{
            let dbEmails =[];
            c.forEach( 
              (dbe) => { 
                dbEmails.push(dbe.dataValues.email);
              }
            );
            UserCheckInvitation.bulkCreate(data, {ignoreDuplicates: true}).then((d) => {
            console.debug('Inserted all user for log');
            console.log(d); 
            
            data.forEach(async (item) => {
              
              // const sendEmail= () =>{ return new Promise((resolve, reject) => {
              if(dbEmails.indexOf(item.email)<0 ){
              console.log("start Email");
              await Axios.post(privateLocalAddress+'/api/sendInvitation', {email: item.email, code: item.uniqe_id, check_code: check.tiny_url, host: hostName,  customMessage, checkName,firstName,lastName,participant,dueDate,language,subject}).then((response)=>{
                console.log('Sent Invitation email');
                //return resolve(true);
              }).catch((err) => {
                logger.error(err.stack);
                console.log('Error in sending Email');
                //console.log(err);
                //return resolve(true);
              });
            } else {
              console.log('email already exists');
            }
          //   });
          // };
           //var d = await sendEmail();
            });
          });
            // TODO Implement here email notification for all email.
            return res.status(200).send('OK');
          }).catch((err) => {
            console.debug('error while sending invitation');
            logger.error(err.stack);
            // return res.status(500).send(err);
            let customError ="";
            if(err.msg !=undefined && err.msg.name !=undefined){
              customError = new Error(err.msg.name);
            }
           err = utils.removeSqlErrorFields(err);
            return res.status(500).send({error:'sqlExp',msg:err});
          });
        } else {
          return res.status(500).send('Emails are empty. Please provide proper emails');
        }
      });
    });
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send(error);
  }
};
/**
 * @api {post} /api/check/users Invite users.
 * @apiName AllInvitedUsers
 * @apiGroup Check
 * @apiHeader {String} x-access-token require latest acces token.
 * @apiParam {Number} check_id unique checkid
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Error
 */
export function allInvitedUsers(req, res) {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.tokenSecret, (e, decoded) => {
      if (e) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      let obj={url:"Get All invited user",user_id:decoded.id};
      logActiveUserInfo(obj);
      const { check_id } = req.params;
      UserCheckInvitation.findAll({where: {user_check_id: check_id}}).then((d) => {
        return res.status(200).send(d);
      });
    });
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send(error);
  }
}

export function updateCheckInvitation(req, res) {
  try{
  const {email,uniqe_id,current_time}=req.body;
  console.log(uniqe_id);
  UserCheckInvitation.update({current_time:sequelize.literal('COALESCE("current_time",0) + '+current_time)},{ where: {email:email,uniqe_id:uniqe_id}}).then((u) => {
    console.log(u);
    if(u!=null && u[0]>0 ){

      res.status(200).send({successMessage:'Updated successfully',statusCode:200});
    }
    else {
      res.status(500).send({successMessage:'Error While update',statusCode:500});
    }
    }).catch((err) => {
      console.log(err);
      logger.error(err.stack);
      res.status(500).send({errorMessage:'We failed to save for some reason'});
    });
}catch(error){
  logger.error(error.stack);
  return res.status(500).send(error);
}
}

export function sendemail(req, res) {
  try{
    const {url}=req.body;
    console.log(url);
    console.log("start Email");
    let subject="Internet Explorer"
    Axios.post(privateLocalAddress+'/api/sendEmailDetectInternetExplorer', {host: url,subject:subject}).then((response)=>{
        console.log('Sent Invitation email');
    }).catch((err) => {
        logger.error(err.stack);
        console.log('Error in sending Email');
    });
  }catch(error){
    logger.error(error.stack);
    return res.status(500).send(error);
  }
}

//completecheckemail
export function completecheckemail(req, res) {
  try{
    const {email,checkName,time,language,checkid,tiny_url}=req.body;
    let subject="Complete check user information";
    console.log("Customer Email : "+email);
    let linkurl = "";
    let completeLink="";
    UserCheckInvitation.findAll({where:{user_check_id:checkid}}).then((items)=>{
      items.forEach((item)=>{
        if(item.email==email){
          completeLink=hostName+"/spotlight/check/"+tiny_url+"/"+item.uniqe_id;
        }
        let link=hostName+"/spotlight/check/"+tiny_url+"/"+item.uniqe_id;
        linkurl+=link+",";
      })
      console.log(linkurl);
      Axios.post(privateLocalAddress+'/api/sendcompletecheckemail', {email:email,checkName:checkName,time:time,language:language,links:linkurl,completeLink:completeLink,subject}).then((response)=>{
        console.log('Sent Check Complete email');
      }).catch((err) => {
          logger.error(err.stack);
          console.log('Error in sending Email');
      });
    }).catch((err) => {
      logger.error(err.stack);
      console.log('Error Getting invitation information');
    });
  }catch(error){
    logger.error(error.stack);
    return res.status(500).send(error);
  }
} 

export default {
  sendInvitation, allInvitedUsers,updateCheckInvitation,sendemail,completecheckemail
    // update
    // remove
  };
