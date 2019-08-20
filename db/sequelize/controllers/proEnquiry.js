import _ from 'lodash';
// import jwt from 'jsonwebtoken';
import { Models, sequelize } from '../models';
//import * as config from '../constants';
import Axios from 'axios';
import {privateLocalAddress, hostName} from '../../../config/app';
const askPro = Models.proEnquiryModel;
var log4js = require('log4js');
const logger = log4js.getLogger('custom');

/**
 * Add record
 */
export function add(req, res) {
  try{
  askPro.create(req.body).then((d) => {
    // console.log("?shdjweb"+d.id);
   // sending pro enquiry email..
   const{email,organization,phone,language,subject}=req.body;
    Axios.post(privateLocalAddress+'/api/sendEnquiry', {request_id: d.id, full_name: d.full_name,email,organization,phone,language,subject}).then((response)=>{
        return res.status(200).send({message:'Sent',date:new Date()});
        console.log('Sent Pro Enquiry email');
    }).catch((err) => {
        console.log('Error in sending Email'+err);
        logger.error(err.stack);
        return  res.status(500).send({errorMesg:err});
    });
    
  }).catch((err) => {
    console.log(err);
    logger.error(err.stack);
    return res.status(400).send(err);
  });
}catch(error){
  logger.error(error.stack);
  return res.status(500).send(error);
}
}
export default {
//   all,
  add
  //update,
  //remove
};
