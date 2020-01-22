import _ from 'lodash';
import { Models, sequelize } from '../models';
var log4js = require('log4js');
const logger = log4js.getLogger('custom');
const Topics = Models.TopicsMaster;
const TestnomialModel= Models.TestnomialModel;
  
  //Add new topics..
  
  function addCustomer(req,res){
    try {
        console.log("Call Add customer API");

        const {company_name,recommande_name,recommande_title,testnomial_en,testnomial_he,is_testnomial,image}=req.body;
        console.log("Company Name : "+ company_name);
        const testnomialData={company_name:company_name,recommande_name:recommande_name,recommande_title:recommande_title,
            testnomial_en:testnomial_en,testnomial_he:testnomial_he,is_testnomial:is_testnomial,image:image,
            "createdAt":new Date(),"updatedAt":new Date()};
        console.log(testnomialData);
            TestnomialModel.create(req.body).then((rs)=>{
            console.log("Call After Add Data");
            if(rs){
                return res.status(200).send({successMessage:'OK',statusCode:200});
            }
        }).catch((error)=>{
            console.log("Call After Error");
            return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});
        })
    } catch (error) {
        console.log("Call After Error cathe");
        logger.error(error.stack);
        console.log(error);
        return res.status(500).send({errorMessage:error,exp:'something went wrong',errorCode:'UNEXPECTED'});
    }
  }

  function getCustomer(req,res){
    try {
        TestnomialModel.findAll().then((customerList)=>{
          if(customerList!=null){
             return res.json(customerList);
          }else{
           return res.status(404).send({errorMessage:'Sorry data not found',errorCode:'UNEXPECTED'});
          }
        }).catch((error)=>{
         logger.error(error.stack);
         return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});   
        })
      } catch (error) {
       logger.error(error.stack);
       return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});
      }
  }

  function remove(req,res){
    try {
     const ID={id:req.params.id};
     TestnomialModel.destroy({where:ID}).then((result)=>{
       if (result > 0) {
         return res.status(200).send({successMessage: 'OK',statusCode:200});
       }
     }).catch((error)=>{
       return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});
     })
    } catch (error) {
     logger.error(error.stack);
     console.log(error);
     return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});
    }
   }
  
  export default {
    addCustomer,
    getCustomer,
    remove
  };  