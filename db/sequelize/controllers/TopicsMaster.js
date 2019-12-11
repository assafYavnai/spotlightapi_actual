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
      Topics.findAll().then((tm)=>{
        const topicData=tm.map((tp)=>{
        let obj={};
        obj=tp.toJSON();
        const filterCategoryMaster=tcm.filter((it)=>{
           return it.id==tp.topic_category_id;
        });
        obj.cateName_en=filterCategoryMaster[0].name_en,
        obj.cateName_he=filterCategoryMaster[0].name_he;
        topicList.push(obj)
        });
        
        return res.json(topicList);
      }) 
   }).catch((err) => {
     logger.error(err.stack);
     console.log(err);
     res.status(500).send('Error in first query');
   })
   }catch(error){
     logger.error(error.stack);
     return res.status(500).send(error);
   }
  }
  
  //Edit topics....
  
  function editTopics(req,res){
    const {topicsName_en,topicName_he,topicId,topic_cate_id,child_Cat_Id}=req.body;
    const topicData={topic_category_id:topic_cate_id,name_en:topicsName_en,name_he:topicName_he,"createdAt":new Date(),"updatedAt":new Date(),child_category_id:child_Cat_Id};
    try {
      Topics.update(topicData,{where:topicId}).then((result)=>{
        if(result){
          return res.status(200).send({successMessage:'OK',status:200});
        }
      }).catch((error)=>{
        return res.status(500).send({errorMessage:error});
      })
    } catch (error) {
      return res.status(500).send({errorMessage:error});
    }
  }
  
  //Add new topics..
  
  function addTopics(req,res){
    try {
      const {topicsName_en,topicName_he,topic_cate_id,child_Cat_Id}=req.body;
    const topicData={topic_category_id:topic_cate_id,name_en:topicsName_en,name_he:topicName_he,"createdAt":new Date(),"updatedAt":new Date(),child_category_id:child_Cat_Id};
      TopicCategoryMaster.create(topicData).then((rs)=>{
        if(rs){
          return res.status(200).send({successMessage:'OK',status:200});
        }
      }).catch((error)=>{
        return res.status(500).send({errorMessage:error});
      })
    } catch (error) {
      return res.status(500).send({errorMessage:error,exp:'something went wrong'});
    }
  }
  
  // Delete Topics and Category
  function deleteTopics(req,res){
   try {
    const ID={id:req.params.id};
    Topics.destroy({where:ID}).then((result)=>{
      return res.status({successMessage:'OK',status:200});
    }).catch((error)=>{
      return res.status(500).send({errorMessage:error});
    })
   } catch (error) {
    return res.status(500).send({errorMessage:error});
   }
  }
  
  
  export default {
    getTopicsMaster,
    addTopics,
    editTopics,
    deleteTopics
    
  };  