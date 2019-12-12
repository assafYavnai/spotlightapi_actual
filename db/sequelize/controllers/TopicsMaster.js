import _ from 'lodash';
import { Models, sequelize } from '../models';
var log4js = require('log4js');
const logger = log4js.getLogger('custom');
const Topics = Models.TopicsMaster;
const TopicCategoryMaster= Models.TopicCategoryMaster;

function getTopicsMaster(req, res) {
    try{
    let topicList=[];
    TopicCategoryMaster.findAll().then((tcm)=>{
      console.log(tcm);
      Topics.findAll().then((tm)=>{
        const topicData=tm.map((tp)=>{
        let obj={};
        obj=tp.toJSON();
        const filterCategoryMaster=tcm.filter((it)=>{
           return it.id==tp.topic_category_id;
        });
        const filterSubCategoryMaster=tcm.filter((a)=>{
          if(a.parent_id!=null){
            return a.id==tp.child_category_id;  
          }
          // return a.id==tp.child_category_id;
       });
       if(filterSubCategoryMaster[0]!=undefined){
        obj.subCatName_en=filterSubCategoryMaster[0].name_en;
        obj.subCatName_he=filterSubCategoryMaster[0].name_he;
       }
       else{
        obj.subCatName_en=null;
        obj.subCatName_he=null;
       }
        obj.cateName_en=filterCategoryMaster[0].name_en,
        obj.cateName_he=filterCategoryMaster[0].name_he;
        //obj.subCatName_en=filterSubCategoryMaster[0].name_en;
        //obj.subCatName_he=filterSubCategoryMaster[0].name_he;
        topicList.push(obj)
        });
        
        return res.json(topicList);
      }) 
   }).catch((err) => {
     logger.error(err.stack);
     console.log(err);
     res.status(500).send({errorMessage:err,errorCode:'UNEXPECTED'});
   })
   }catch(error){
     logger.error(error.stack);
     return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});
   }
  }
  
  //Edit topics....
  
  function editTopics(req,res){
    try {
      const {topicsName_en,topicName_he,topicId,topic_cate_id,child_Cat_Id}=req.body;
      const topicData={topic_category_id:topic_cate_id,name_en:topicsName_en,name_he:topicName_he,"createdAt":new Date(),"updatedAt":new Date(),child_category_id:child_Cat_Id};
      //console.log(topicData);
      Topics.update(topicData,{where:{id:topicId}}).then((result)=>{
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
  
  //Add new topics..
  
  function addTopics(req,res){
    try {
      const {topicsName_en,topicName_he,topic_cate_id,child_Cat_Id}=req.body;
    const topicData={topic_category_id:topic_cate_id,name_en:topicsName_en,name_he:topicName_he,"createdAt":new Date(),"updatedAt":new Date(),child_category_id:child_Cat_Id};
      Topics.create(topicData).then((rs)=>{
        if(rs){
          return res.status(200).send({successMessage:'OK',statusCode:200});
        }
      }).catch((error)=>{
        return res.status(500).send({errorMessage:error,errorCode:'UNEXPECTED'});
      })
    } catch (error) {
      logger.error(error.stack);
     console.log(error);
      return res.status(500).send({errorMessage:error,exp:'something went wrong',errorCode:'UNEXPECTED'});
    }
  }
  
  // Delete Topics and Category
  function deleteTopics(req,res){
   try {
    const ID={id:req.params.id};
    Topics.destroy({where:ID}).then((result)=>{
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
    getTopicsMaster,
    addTopics,
    editTopics,
    deleteTopics
    
  };  