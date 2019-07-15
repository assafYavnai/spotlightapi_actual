import _ from 'lodash';
// import jwt from 'jsonwebtoken';
import { Models, sequelize } from '../models';
//import * as config from '../constants';
import Axios from 'axios';
import {privateLocalAddress, hostName} from '../../../config/app';
const askPro = Models.proEnquiryModel;

/**
 * Add record
 */
export function add(req, res) {
  try{
  askPro.create(req.body).then((d) => {
    // console.log("?shdjweb"+d.id);
   // sending pro enquiry email..
   const{email,organization,phone}=req.body;
    Axios.post(privateLocalAddress+'/api/sendEnquiry', {request_id: d.id, full_name: d.full_name,email,organization,phone}).then((response)=>{
        res.status(200).send({message:'Sent',date:new Date()});
        console.log('Sent Pro Enquiry email');
    }).catch((err) => {
        console.log('Error in sending Email'+err);
        res.status(500).send({errorMesg:err});
    });
    
  }).catch((err) => {
    console.log(err);
    res.status(400).send(err);
  });
}catch(error){
  return res.status(500).send(error);
}
}
export default {
//   all,
  add
  //update,
  //remove
};
