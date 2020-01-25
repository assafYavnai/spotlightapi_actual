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
        console.log("CompanyName "+req.body.company_name);
        //console.log("File Name "+req.file.filename);
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
        TestnomialModel.findAll({order: [
          ['id', 'DESC'],
        ]}).then((customerList)=>{
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

  function editCustomer(req,res){
    try {
      console.log("Call Update API");
      const {customerId,company_name,recommande_name,recommande_title,testnomial_en,testnomial_he,is_testnomial,image}=req.body;
      console.log(customerId);
      const customerData={company_name:company_name,recommande_name:recommande_name,recommande_title:recommande_title,testnomial_en:testnomial_en,
        testnomial_he:testnomial_he,is_testnomial:is_testnomial,image:image,"updatedAt":new Date()};
      TestnomialModel.update(customerData,{where:{id:customerId}}).then((result)=>{
        if(result){
          return res.status(200).send({successMessage:'OK',statusCode:200});
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

  function changePhoto(req, res) {
    const photo = req.file.filename
    let customerId=req.params.id;
    if(customerId==0){
      TestnomialModel.max('id').then(function(getID){
        if(Number.isNaN(getID)){
          customerId=1;
          console.log("Coming ID:"+getID);
          console.log("GET MAXID:"+customerId);
        }else{
          customerId=getID;
          console.log("Coming ID:"+getID);
          console.log("GET MAXID:"+customerId);
        }
        console.log("File Name "+photo);
        return TestnomialModel
        .findById(customerId)
        .then((profile) => {
          profile.update({
            image: photo || profile.image
        })
        .then((updatedProfile) => {
            res.status(200).send({
            message: 'profile photo updated successfully',
            data: {
            photo: photo
            }
            })
        })
        .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error)); 
      }).catch(error => res.status(400).send(error));
    }
    else{
      console.log("File Name "+photo);
      return TestnomialModel
        .findById(customerId)
        .then((profile) => {
          profile.update({
            image: photo || profile.image
        })
        .then((updatedProfile) => {
            res.status(200).send({
            message: 'profile photo updated successfully',
            data: {
            photo: photo
            }
            })
        })
        .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    }
    
  }
  
  export default {
    addCustomer,
    getCustomer,
    remove,
    editCustomer,
    changePhoto
  };  