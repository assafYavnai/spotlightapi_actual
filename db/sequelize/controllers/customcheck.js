import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { Models, sequelize } from '../models';
var log4js = require('log4js');
const logger = log4js.getLogger('custom');

const uuidv1 = require('uuid/v1');

const {
UserCheck, UserCheckTopics, TopicsMaster, UserCheckInvitation, UserGroups, UserGroupsEmail, TopicCategoryMaster
} = Models;
const UserMaster = Models.User;
const ReportSharableLink=Models.ReportSharableLinkModel;


/**
 * @api {post} /api/checks/topicspool Create or Update Check.
 * @apiName CreateOrUpdateCheck
 * @apiGroup Check
 * @apiHeader {String} x-access-token require latest acces token.
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
          "id": 5,
          "check_master_code": "CORE",
          "theme_id": 2,
          "name_en": "first core check updaed",
          "description_en": null,
          "name_he": null,
          "description_he": null,
          "is_active": null,
          "payment_completed": false,
          "start_date": "2019-12-11T18:30:00.000Z",
          "end_date": "2019-12-11T18:30:00.000Z",
          "tiny_url": null,
          "phone": "9268310732",
          "email": "munna@ferventsoft.com",
          "created_on": null,
          "updated_on": null,
          "conclusion": null,
          "is_pro_report_ready": false,
          "createdAt": "2019-06-03T07:16:00.464Z",
          "updatedAt": "2019-06-03T07:16:00.464Z"
        }
 */
export function fetchTopicsPool(req, res) {
  try {
      let results={category:[],topics:[]};
      TopicCategoryMaster.findAll({where: {parent_id:null}}).then( (pCategory) =>{
        pCategory.forEach( (c) => {
          let dtoCategory={id:c.id,name_en:c.name_en,name_he:c.name_he,sub_category: []};
          TopicCategoryMaster.findAll({where: {parent_id:c.id}}).then( (cCategory) =>{
            if(cCategory.length>0){
              cCategory.forEach( (c) => {
                let dtoSubCategory={id:c.id,name_en:c.name_en,name_he:c.name_he};
                dtoCategory.sub_category.push(dtoSubCategory);
              });
            }
            results.category.push(dtoCategory);
            if(pCategory.indexOf(c)==pCategory.length-1 ){
                TopicsMaster.findAll({where:{check_type:'CUSTOM'}}).then( (d)=>{
                    if(d.length>0){
                      d.forEach(item=>{
                        const obj={name_he:item.name_he,name_en:item.name_en,category:item.topic_category_id,
                          sub_category:item.child_category_id};
                        results.topics.push(obj);
                      });
                    }
                    
                      return res.status(200).send(results);  
                    
                    
                }).catch((error) => {
                  logger.error(error.stack);
                  return res.status(500).send('Something went wrong.' + error);
              });
            }
          }).catch((error) => {
            logger.error(error.stack);
            return res.status(500).send('Something went wrong.' + error);
        });
        });
        
      });
    } catch (error) {
      logger.error(error.stack);
      return res.status(500).send(error);
    }
}
export default {
  fetchTopicsPool
    // update
    // remove
};
