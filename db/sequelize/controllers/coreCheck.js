import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { Models, sequelize } from '../models';
import * as config from '../constants';
import checkInvitation from './checkInvitation';
import {logActiveUserInfo} from '../activeusers';
var log4js = require('log4js');
const logger = log4js.getLogger('custom');

const uuidv1 = require('uuid/v1');

const {
UserCheck, UserCheckTopics, TopicsMaster, UserCheckInvitation, UserGroups, UserGroupsEmail,userCheckSharable
} = Models;
const UserMaster = Models.User;
const ReportSharableLink=Models.ReportSharableLinkModel;
/**
 * @api {get} /api/checks/pending Last Pending check.
 * @apiName PendingCheck
 * @apiGroup Check
 * @apiHeader {String} x-access-token require latest acces token.
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
        user_id: 1
        check_master_code: 'CORE',
        theme_id: 1,
        name_en: 'Name of check',
        description_en: 'Description of Check',
        name_he: 'Name of check in hebrew',
        description_he: 'Description of check if need to add',
        is_active: true,
        payment_completed: false,
        start_date: '01-01-2011',
        end_date: '01-04-2011',
        tiny_url: 'https://sgoogle.com',
        phone: '',
        email: '',
        conclusion: DataTypes.STRING,
        is_pro_report_ready: DataTypes.BOOLEAN
      }
 */
export function pending(req, res) {
  try {
  const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      let userid=decoded.id;
      let obj={url:"Change Password",user_id:userid};
      logActiveUserInfo(obj);
      UserCheck.findOne({where: {payment_completed: false}}).then((d) => {
        return res.status(200).send(d);
      }).catch((error) => {
        console.debug('error while fetching pending checks');
        logger.error(error.stack);
        console.debug(error);
        return res.status(500).send(error);
      });
    });
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send(error);
  }
}
/**
 * @api {get} /api/checks/remove delete check by id.
 * @apiName DeleteCheck
 * @apiGroup Check
 * @apiParam {Number} id id to delete check.
 * @apiHeader {String} x-access-token require latest acces token.
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK *
 */
export function remove(req, res) {
  try {
  const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      let userid=decoded.id;
      let obj={url:"Remove Topic",user_id:userid};
      logActiveUserInfo(obj);
      UserCheck.destroy({where: {id: req.body.id}}).then((d) => {
        if (d > 0) {
          return res.status(200).send({success: true});
        }
          res.statusMessage = 'Unable to delete. Please try again';
          return res.status(500).send({success: false});
      }).catch((error) => {
        console.debug('error while fetching pending checks');
        logger.error(error.stack);
        console.debug(error);
        return res.status(500).send(error);
      });
    });
  } catch (error) {
    logger.error(error.stack);
    return res.status(500).send(error);
  }
}
/**
 * @api {get} /api/checks All Check for dashboard.
 * @apiName AllCheck
 * @apiGroup Check
 * @apiHeader {String} x-access-token require latest acces token.
 * @apiDescription provide list of all check created by user. If user has admin role, can access
 * all users check.
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
        user_id: 1
        check_master_code: 'CORE',
        theme_id: 1,
        name_en: 'Name of check',
        description_en: 'Description of Check',
        name_he: 'Name of check in hebrew',
        description_he: 'Description of check if need to add',
        is_active: true,
        payment_completed: false,
        start_date: '01-01-2011',
        end_date: '01-04-2011',
        tiny_url: 'https://sgoogle.com',
        phone: '',
        email: '',
        conclusion: DataTypes.STRING,
        is_pro_report_ready: DataTypes.BOOLEAN
      }]
 */
export function all(req, res) {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      let userid=req.body.id;
      if(userid==0){
        userid=decoded.id;
      }
      let obj={url:"Get All Checks",user_id:userid};
      logActiveUserInfo(obj);
      UserMaster.findById(userid).then((user) => {
        
          UserCheck.findAll({attributes: ['check_master_code', 'user_id','name_en','name_he','is_active',
        'start_date','end_date','tiny_url','is_pro_report_ready','id','language','sharable_url','createdAt'],
            //where: (user.isadmin?{}:{user_id: decoded.id.toString()}),
            where: ({user_id: userid.toString()}),
            order: [
                        ['id', 'DESC'],
                    ]
            }).then((d) => {
            
            if(d==null || d.length==0){
              return res.status(404).send({ message: 'Check not exist.' });
            }
            const data = [];
            // data.invitedUsersData=[];
            // data.sharedUsersData=[];
            const checks = d.map((p) => {
              return p.id;
            });
            console.log(checks);
            UserCheckInvitation.findAll({
              where: {
                  user_check_id: {
                  [sequelize.Op.in]: checks
                }
              }
            }).then((i) => {
              sequelize.query(`SELECT *,round((tbl.answered::numeric/total::numeric)*100,0) as topics_completed FROM (SELECT a.user_check_id,count(b.id) as answered ,(SELECT count(*) from user_check_invitations ci 
              inner join user_check_topics ct on ct.user_check_id=ci.user_check_id  where ci.user_check_id=a.user_check_id) as total    
              FROM user_check_topics a
              left join user_check_topics_answers b on a.id=b.user_check_topic_id 
              inner join user_check_invitations c on c.uniqe_id=b.user_id WHERE a.user_check_id in (${checks.toString()}) group by a.user_check_id order by user_check_id)
               tbl where total>0`, { type: sequelize.QueryTypes.SELECT }).then( (t) => {
               
                d.forEach((item) => {
                  const obj = item.toJSON();
                  obj.completed = parseFloat((i.filter((t) => {
                    return t!=undefined && t.is_completed === true && t.user_check_id === obj.id;
                  }).length) / (i.filter((t) => {
                    return t!=undefined && t.user_check_id === obj.id;
                  }).length)) * 100;
                  const completed_arr = t.filter((s)=>{
                    return (s.user_check_id === obj.id);
                  });
                  obj.topics_completed=0;
                  obj.answered=0;
                    obj.total=0;
                  obj.totalParticipant=i.filter((k)=>{
                    return k.user_check_id === obj.id;
                  }).length;
                  if(completed_arr.length>0){
                    obj.topics_completed=parseInt(completed_arr[0].topics_completed);
                    obj.answered=completed_arr[0].answered;
                    obj.total=completed_arr[0].total;
                  }
                  data.push(obj);
                });

              // calculation for sharable link
              userCheckSharable.findAll({
              where: {
                  user_check_id: {
                  [sequelize.Op.in]: checks
                }
              }
              }).then((j) => {
                sequelize.query(`SELECT *,round((tbl.answered::numeric/total::numeric)*100,0) as topics_completed FROM (SELECT a.user_check_id,(SELECT sum(si.current_topic) from user_check_sharables si where si.user_check_id=a.user_check_id) as answered ,(SELECT count(*) from user_check_sharables ci 
                inner join user_check_topics ct on ct.user_check_id=ci.user_check_id  where ci.user_check_id=a.user_check_id) as total    
                FROM user_check_topics a
                left join user_check_topics_answers b on a.id=b.user_check_topic_id 
                inner join user_check_sharables c on c.uniqe_id=b.user_id WHERE a.user_check_id in (${checks.toString()}) group by a.user_check_id order by user_check_id)
                tbl where total>0`, { type: sequelize.QueryTypes.SELECT }).then( (sl) => {

                  data.forEach((item) => {
                    //const sobj = item.toJSON();
                    item.sharedcompleted = parseFloat((j.filter((t) => {
                      return t!=undefined && t.is_completed === true && t.user_check_id === item.id;
                    }).length) / (j.filter((t) => {
                      return t!=undefined && t.user_check_id === item.id;
                    }).length)) * 100;
                    const sharedcompleted_arr = sl.filter((s)=>{
                      return (s.user_check_id === item.id);
                    });
                    item.sharedtopics_completed=0;
                    item.sharedanswered=0;
                    item.sharedtotal=0;
                    item.sharedtotalParticipant=j.filter((k)=>{
                      return k.user_check_id === item.id;
                    }).length;
                    if(sharedcompleted_arr.length>0){
                      item.sharedtopics_completed=parseInt(sharedcompleted_arr[0].topics_completed);
                      item.sharedanswered=sharedcompleted_arr[0].answered;
                      item.sharedtotal=sharedcompleted_arr[0].total;
                    }
                    //data.sharedUsersData.push(sobj);
                  });
                  // data.sharedUsersData=data.sharedUsersData.filter((filteritem)=>{
                  //   return filteritem.totalParticipant>0;
                  // }); 
                  return res.status(200).send(data);
                }).catch( (err) => {
                  logger.error(err.stack);
                  return res.status(500).send(err);
                });
              })

              }).catch( (err) => {
                logger.error(err.stack);
                return res.status(500).send(error);
              });
            });

          }).catch((error) => {
            console.debug('error while fetching users check');
            console.debug(error);
            logger.error(error.stack);
            return res.status(500).send(error);
          });
        
      });
    });
  } catch (err) {
    console.log(err);
    logger.error(err.stack);
    return res.status(500).send(err);
  }
}


export function completed(req, res) {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      let userid=req.body.id;
      console.log(req.body);
      console.log("User id :" + req.body.id);
      if(userid==0){
        userid=decoded.id;
      }
      let obj={url:"get Completed Checks",user_id:userid};
      logActiveUserInfo(obj);
      UserMaster.findById(userid).then((user) => {
        
        sequelize.query(`  select uc.* from user_checks uc inner join (select  sum(CASE WHEN is_completed =true then 1 else 0 end)/count(id) as checkcompleted,user_check_id  from user_check_invitations 
        where user_check_id is not null group by user_check_id) tbl on uc.id=tbl.user_check_id where uc.user_id='${userid}' order by checkcompleted desc,end_date desc`, 
        { type: sequelize.QueryTypes.SELECT }).then((d) => {
            
            if(d==null || d.length==0){
              return res.status(404).send({ message: 'Check not exist.' });
            }
            const data = [];
            const checks = d.map((p) => {
              return p.id;
            });
            console.log(checks);
            UserCheckInvitation.findAll({
              where: {
                  user_check_id: {
                  [sequelize.Op.in]: checks
                }
              }
            }).then((i) => {
            // if(i==null || i.length==0){
            //   return res.status(404).send({ message: 'Check Invitation not exist.' });
            // }
              sequelize.query(`SELECT *,round((tbl.answered::numeric/total::numeric)*100,0) as topics_completed FROM (SELECT a.user_check_id,count(b.id) as answered ,(SELECT count(*) from user_check_invitations ci 
              inner join user_check_topics ct on ct.user_check_id=ci.user_check_id  where ci.user_check_id=a.user_check_id) as total    
              FROM user_check_topics a
              left join user_check_topics_answers b on a.id=b.user_check_topic_id WHERE user_check_id in (${checks.toString()}) group by a.user_check_id order by user_check_id)
               tbl where total>0`, { type: sequelize.QueryTypes.SELECT }).then( (t) => {
               
                d.forEach((item) => {
                  console.log("completed item");
                  console.log(item);
                  const obj = item;
                  obj.completed = parseFloat((i.filter((t) => {
                    return t!=undefined && t.is_completed === true && t.user_check_id === obj.id;
                  }).length) / (i.filter((t) => {
                    return t!=undefined && t.user_check_id === obj.id;
                  }).length)) * 100;
                  const completed_arr = t.filter((s)=>{
                    return (s.user_check_id === obj.id);
                  });
                  obj.topics_completed=0;
                  obj.answered=0;
                    obj.total=0;
                  obj.totalParticipant=i.filter((k)=>{
                    return k.user_check_id === obj.id;
                  }).length;
                  if(completed_arr.length>0){
                    obj.topics_completed=parseInt(completed_arr[0].topics_completed);
                    obj.answered=completed_arr[0].answered;
                    obj.total=completed_arr[0].total;
                  }
                  data.push(obj);
                });
                // calculation for sharable link
                userCheckSharable.findAll({
                where: {
                    user_check_id: {
                    [sequelize.Op.in]: checks
                  }
                }
                }).then((j) => {
                  sequelize.query(`SELECT *,round((tbl.answered::numeric/total::numeric)*100,0) as topics_completed FROM (SELECT a.user_check_id,(SELECT sum(si.current_topic) from user_check_sharables si where si.user_check_id=a.user_check_id) as answered ,(SELECT count(*) from user_check_sharables ci 
                  inner join user_check_topics ct on ct.user_check_id=ci.user_check_id  where ci.user_check_id=a.user_check_id) as total    
                  FROM user_check_topics a
                  left join user_check_topics_answers b on a.id=b.user_check_topic_id 
                  inner join user_check_sharables c on c.uniqe_id=b.user_id WHERE a.user_check_id in (${checks.toString()}) group by a.user_check_id order by user_check_id)
                  tbl where total>0`, { type: sequelize.QueryTypes.SELECT }).then( (sl) => {
  
                    data.forEach((item) => {
                      //const sobj = item.toJSON();
                      item.sharedcompleted = parseFloat((j.filter((t) => {
                        return t!=undefined && t.is_completed === true && t.user_check_id === item.id;
                      }).length) / (j.filter((t) => {
                        return t!=undefined && t.user_check_id === item.id;
                      }).length)) * 100;
                      const sharedcompleted_arr = sl.filter((s)=>{
                        return (s.user_check_id === item.id);
                      });
                      item.sharedtopics_completed=0;
                      item.sharedanswered=0;
                      item.sharedtotal=0;
                      item.sharedtotalParticipant=j.filter((k)=>{
                        return k.user_check_id === item.id;
                      }).length;
                      if(sharedcompleted_arr.length>0){
                        item.sharedtopics_completed=parseInt(sharedcompleted_arr[0].topics_completed);
                        item.sharedanswered=sharedcompleted_arr[0].answered;
                        item.sharedtotal=sharedcompleted_arr[0].total;
                      }
                    }); 
                    return res.status(200).send(data);
                  }).catch( (err) => {
                    logger.error(err.stack);
                    return res.status(500).send(err);
                  });
                })
                // return res.status(200).send(data);
          }).catch( (err) => {
            logger.error(err.stack);
            return res.status(500).send(error);
          });
             
            });
          }).catch((error) => {
            console.debug('error while fetching users check');
            console.debug(error);
            logger.error(error.stack);
            return res.status(500).send(error);
          });
        
      });
    });
  } catch (err) {
    console.log(err);
    logger.error(err.stack);
    return res.status(500).send(err);
  }
}



/**
 * @api {post} /api/checks/core/add Create or Update Check.
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
export function CreateOrUpdate(req, res) {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.tokenSecret, (err, decoded) => {
          if (err) {
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
          }
          const data = req.body;
          data.user_id = decoded.id;
          let userid=decoded.id;
          let obj={url:"Create update check",user_id:userid};
          logActiveUserInfo(obj);
          if (data.id > 0) { // go for update
            delete data.tiny_url;
            UserCheck.update(data, {where: { id: data.id}}).then((uc) => {
                UserCheckTopics.destroy({where: {user_check_id: data.id}}).then((deleted) => {
                  console.log('deleted topics from check');
                  console.log(deleted);
                  TopicsMaster.findAll({where: {theme_id: data.theme_id}, order: [
                    ['sequence', 'ASC']
                ]}).then((d) => {
                    const topics = [];
                    d.forEach((tm) => {
                      topics.push({
                        user_check_id: data.id,
                        user_id: data.user_id,
                        topic_category_id: tm.topic_category_id,
                        text_en: tm.name_en,
                        text_he: tm.name_he,
                        is_active: true,
                        estimated_time: tm.estimated_time
                      });
                    });
                    if (topics.length > 0) {
                        UserCheckTopics.bulkCreate(topics).then((t) => {
                            return res.status(200).send(uc);
                        }).catch((e) => {
                            console.debug('Error occured while saving user check topics');
                            console.debug(e);
                            logger.error(e.stack);
                            return res.status(500).send(e);
                        });
                    } else {
                      return res.status(500).send('topics not available for selected theme');
                    }
                });
                });
            }).catch((error) => {
               logger.error(error.stack);
               return res.status(500).send('Something went wrong.' + error);
            });
          } else { // go to create new check
            data.tiny_url = uuidv1();
            data.sharable_url=uuidv1();
            UserCheck.create(data).then((uc) => {
               const user_checkId=uc.id;
              
              //  if(user_checkId>0){
              //   // Generate 50 character String random unique id and make entry for Report_Sharable link
              //   const stringUniqueId=(length)=> {
              //     var result = '';
              //     var characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              //     var charactersLength = characters.length;
              //     for ( var i = 0; i < length; i++ ) {
              //        result += characters.charAt(Math.floor(Math.random() * charactersLength));
              //     }
              //     return result;
              //  }
              //   const uniqueId=stringUniqueId(50);
              //   const reportData={user_check_id:user_checkId,tiny_url:uniqueId};
              //     ReportSharableLink.create(reportData).then(()=>{
              //    return res.status(200).send(uc);
              //  }).catch((err) => {
              //   console.log(err);
              //   res.status(400).send(err);
              // });

    
              //  }
          
                console.debug('New check created');
                // delete topics if already exists
                UserCheckTopics.destroy({where: {user_check_id: uc.id}});
                // find all topics for selected theme and insert to userchecktopics
                TopicsMaster.findAll({where: {theme_id: uc.theme_id}, order: [
                  ['sequence', 'ASC']
              ]}).then((d) => {
                    const topics = [];
                    d.forEach((tm) => {
                        topics.push({
                              user_check_id: uc.id,
                              user_id: data.user_id,
                              topic_category_id: tm.topic_category_id,
                              text_en: tm.name_en,
                              text_he: tm.name_he,
                              is_active: true,
                              estimated_time: tm.estimated_time
                            });
                    });
                    if (topics.length > 0) {
                        UserCheckTopics.bulkCreate(topics).then((t) => {
                            
                            return res.status(200).send(uc);
                        }).catch((e) => {
                            console.debug('Error occured while saving user check topics');
                            console.debug(e);
                            logger.error(e.stack);
                            return res.status(500).send(e);
                        });
                    } else {
                    return res.status(500).send('topics not available for selected theme');
                  }
                });
            }).catch((error) => {
                logger.error(error.stack);
                return res.status(500).send('Something went wrong.' + error);
            });
          }
        });
      } catch (error) {
        logger.error(error.stack);
        return res.status(500).send(error);
      }
}
/**
 * @api {post} /api/checks/custom/add Create or Update Check.
 * @apiName CreateOrUpdateCheckCustom
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
          "updatedAt": "2019-06-03T07:16:00.464Z",
          "topics": [{
                        main_category:1,
                        sub_category:2,
                        text: 'new topics',
                        estimated_time: tm.estimated_time
                      },{
                        main_category:1,
                        sub_category:2,
                        text: 'new topics',
                        estimated_time: tm.estimated_time
                      },]
        }
 */
export function CreateOrUpdateCheckCustom(req, res) {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.tokenSecret, (err, decoded) => {
          if (err) {
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
          }
          let userid=decoded.id;
          let obj={url:"create update custom check",user_id:userid};
          logActiveUserInfo(obj);
          const data = req.body;
          if(data.topics==undefined || data.topics.length==0){
            throw new Error("topics parameter is missing.");
          }
          data.user_id = decoded.id;
          if (data.id > 0) { // go for update
            delete data.tiny_url;
            UserCheck.update(data, {where: { id: data.id}}).then((uc) => {
                UserCheckTopics.destroy({where: {user_check_id: data.id}}).then((deleted) => {
                  console.log('deleted topics from check');
                  console.log(deleted);
                   const topics = [];
                    data.topics.forEach((tm) => {
                      topics.push({
                        user_check_id: data.id,
                        user_id: data.user_id,
                        topic_category_id: tm.main_category,
                        child_category_id: tm.sub_category,
                        text_en: tm.name_en,
                        text_he: tm.name_he,
                        is_active: true,
                        estimated_time: tm.estimated_time
                      });
                    });
                    if (topics.length > 0) {
                        UserCheckTopics.bulkCreate(topics).then((t) => {
                            return res.status(200).send(uc);
                        }).catch((e) => {
                            console.debug('Error occured while saving user check topics');
                            console.debug(e);
                            logger.error(e.stack);
                            return res.status(500).send(e);
                        });
                    } else {
                      return res.status(500).send('topics not available for selected theme');
                    }
                
                });
            }).catch((error) => {
               logger.error(error.stack);
               return res.status(500).send('Something went wrong.' + error);
            });
          } else { // go to create new check
            data.tiny_url = uuidv1();
            data.sharable_url=uuidv1();
            UserCheck.create(data).then((uc) => {
               const user_checkId=uc.id;
              console.debug('New check created');
                // delete topics if already exists
                UserCheckTopics.destroy({where: {user_check_id: uc.id}});
                // find all topics for selected theme and insert to userchecktopics
               
                    const topics = [];
                    data.topics.forEach((tm) => {
                        topics.push({
                              user_check_id: uc.id,
                              user_id: data.user_id,
                              topic_category_id: tm.main_category,
                              child_category_id: tm.sub_category,
                              text_en: tm.name_en,
                              text_he: tm.name_he,
                              is_active: true,
                              estimated_time: tm.estimated_time
                            });
                    });
                    if (topics.length > 0) {
                        UserCheckTopics.bulkCreate(topics).then((t) => {
                            
                            return res.status(200).send(uc);
                        }).catch((e) => {
                            console.debug('Error occured while saving user check topics');
                            console.debug(e);
                            logger.error(e.stack);
                            return res.status(500).send(e);
                        });
                    } else {
                    return res.status(500).send('topics not available for selected theme');
                  }
                
            }).catch((error) => {
                logger.error(error.stack);
                return res.status(500).send('Something went wrong.' + error);
            });
          }
        });
      } catch (error) {
        logger.error(error.stack);
        return res.status(500).send(error);
      }
}
/**
 * @api {post} /api/checks/core/update Will only update check information not topics
 * @apiName UpdateCheck
 * @apiGroup Check
 * @apiHeader {String} x-access-token require latest acces token.
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     0/1
 */
export function updateCheck(req, res) {
  try {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, config.tokenSecret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        const data = req.body;
        data.user_id = decoded.id;
        let userid=decoded.id;
        let obj={url:"update check",user_id:userid};
        logActiveUserInfo(obj);
        if (data.id > 0) { // go for update
          delete data.tiny_url;
          UserCheck.update(data, {where: { id: data.id}}).then((uc) => {
              return res.status(200).send(uc);
          }).catch((error) => {
             logger.error(error.stack);
             return res.status(500).send('Something went wrong.' + error);
          });
        } else { // go to create new check
          return res.status(404).send('This check does not exists');
        }
      });
    } catch (error) {
      logger.error(error.stack);
      return res.status(500).send(error);
    }
}

export function addGroup(req, res) {
        const token = req.headers['x-access-token'];
        if (!token) {
          return res.status(401).send({ auth: false, message: 'No token provided.' });
        }

        jwt.verify(token, config.tokenSecret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        const data = req.body;
        data.user_id = decoded.id;
        console.log('user_id', data.user_id);
        if (data.id > 0) { // go for update
          UserGroups.update(data, {where: { id: data.id}}).then((uc) => {
            
            console.debug('Updated group');
            UserGroupsEmail.destroy({where: {group_id: data.id}}).then((deleted) => {
              console.log('deleted emails from user groups email');
              
              const { emailList } = req.body;
              const emaildata = [];
              emailList.split(',').forEach((item) => {
                // insert this email into user group email table.
                emaildata.push({
                  group_id: data.id,
                  email: item
                });
              });
              if (emaildata.length > 0) {
                const groupList = [];
                emaildata.forEach((item) => {
                  UserGroupsEmail.create(item).then((gc) => {
                    
                    groupList.push(gc);
                    if (groupList.length == emaildata.length) {
                      console.log('group id', data.id);
                      UserGroups.findAll({where: {id: data.id}}).then((gr) => {
                        return res.status(200).send([{group: gr, emailList: groupList}]);
                      }).catch((error) => {
                        return res.status(500).send('Something went wrong.' + error);
                      });
                    }
                  }).catch((error) => {
                    logger.error(error.stack);
                    return res.status(500).send('Something went wrong.' + error);
                  });
                });
              }
            }).catch((error) => {
              logger.error(error.stack);
              return res.status(500).send('Something went wrong.' + error);
            });
          }).catch((error) => {
            logger.error(error.stack);
            return res.status(500).send('Something went wrong.' + error);
          });
        } else { // go to create new group
          UserGroups.findOne({ where: { group_name:data.group_name,user_id:data.user_id }}).then((existinggroup) => {
            if(existinggroup){
              return res.status(409).send({errorMessage: 'Sorry this group name already exist',status: 409});
            }
            UserGroups.create(data).then((uc) => {
              
              const { emailList } = req.body;
              const emaildata = [];
              emailList.split(',').forEach((item) => {
                // insert this email into user group email table.
                emaildata.push({
                  group_id: uc.id,
                  email: item
                });
              });
              if (emaildata.length > 0) {
                const groupList = [];
                emaildata.forEach((item) => {
                  UserGroupsEmail.create(item).then((gc) => {
                   
                    groupList.push(gc);
                    if (groupList.length == emaildata.length) {
                      return res.status(200).send([{group: uc, emailList: groupList}]);
                    }
                  }).catch((error) => {
                    logger.error(error.stack);
                    return res.status(500).send('Something went wrong.' + error);
                  });
                });
              }
          }).catch((error) => {
              logger.error(error.stack);
              return res.status(500).send('Something went wrong.' + error);
          });
          }).catch((error) => {
            logger.error(error.stack);
            return res.status(500).send('Something went wrong.' + error);
        });
        }
      });
}

export function getUserGroup(req, res) {
  try {
    console.log('get user group list');
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      UserGroups.findAll({where: {user_id: decoded.id}}).then((groups) => {
        if (groups != null && groups.length > 0) {
          const groupIds = groups.map((i) => {
            return i.id;
          });
            UserGroupsEmail.findAll({
                where: { group_id: {[sequelize.Op.in]: groupIds}},
                order: [
                              ['id', 'DESC'],
                            ]
                }).then((d) => {
              res.status(200).send({groups, emails: d});
            }).catch((error) => {
              logger.error(error.stack);
              return res.status(500).send('Something went wrong.' + error);
            });
        } else {
          return res.status(404).send('Email groups not created yet.');
        }
      }).catch((error) => {
        logger.error(error.stack);
        return res.status(500).send('Something went wrong.' + error);
      });
    });
  } catch (err) {
    console.log(err);
    logger.error(err.stack);
    return res.status(500).send(err);
  }
}

export function removeGroup(req, res) {
  const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      UserGroups.destroy({where: {id: req.body.id}}).then((d) => {
        if (d > 0) {
          UserGroupsEmail.destroy({where: {group_id: req.body.id}}).then((gd) => {
            if (gd > 0) {
              return res.status(200).send({success: true});
            }
            res.statusMessage = 'Unable to delete. Please try again';
            return res.status(500).send({success: false});
          }).catch((error) => {
            console.debug('error while fetching group list');
            logger.error(error.stack);
            console.debug(error);
            return res.status(500).send(error);
          });
        }
      }).catch((error) => {
        console.debug('error while fetching pending checks');
        logger.error(error.stack);
        console.debug(error);
        return res.status(500).send(error);
      });
    });
}

/// Quick Check Add Function
export function CreateOrUpdateCheckQuick(req, res) {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.tokenSecret, (err, decoded) => {
          if (err) {
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
          }
          const data = req.body;
          let userid=decoded.id;
          let obj={url:"create quick check",user_id:userid};
          logActiveUserInfo(obj);
          if(data.topics==undefined || data.topics.length==0){
            throw new Error("topics parameter is missing.");
          }
          data.user_id = decoded.id;
          
          if (data.id > 0) { // go for update
            delete data.tiny_url;
            UserCheck.update(data, {where: { id: data.id}}).then((uc) => {
                UserCheckTopics.destroy({where: {user_check_id: data.id}}).then((deleted) => {
                  console.log('deleted topics from check');
                  console.log(deleted);
                   const topics = [];
                    data.topics.forEach((tm) => {
                      topics.push({
                        user_check_id: data.id,
                        user_id: data.user_id,
                        topic_category_id: tm.main_category,
                        child_category_id: tm.sub_category,
                        text_en: tm.name_en,
                        text_he: tm.name_he,
                        is_active: true,
                        estimated_time: tm.estimated_time
                      });
                    });
                    if (topics.length > 0) {
                        UserCheckTopics.bulkCreate(topics).then((t) => {
                            return res.status(200).send(uc);
                        }).catch((e) => {
                            console.debug('Error occured while saving user check topics');
                            console.debug(e);
                            logger.error(e.stack);
                            return res.status(500).send(e);
                        });
                    } else {
                      return res.status(500).send('topics not available for selected theme');
                    }
                
                });
            }).catch((error) => {
               logger.error(error.stack);
               return res.status(500).send('Something went wrong.' + error);
            });
          } else { // go to create new check
            data.tiny_url = uuidv1();
            data.sharable_url=uuidv1();
            UserCheck.create(data).then((uc) => {
               const user_checkId=uc.id;
              console.debug('New check created');
                // delete topics if already exists
                UserCheckTopics.destroy({where: {user_check_id: uc.id}});
                // find all topics for selected theme and insert to userchecktopics
               
                    const topics = [];
                    data.topics.forEach((tm) => {
                        topics.push({
                              user_check_id: uc.id,
                              user_id: data.user_id,
                              topic_category_id: tm.main_category,
                              child_category_id: tm.sub_category,
                              text_en: tm.name_en,
                              text_he: tm.name_he,
                              is_active: true,
                              estimated_time: tm.estimated_time
                            });
                    });
                    if (topics.length > 0) {
                        UserCheckTopics.bulkCreate(topics).then((t) => {
                            
                            return res.status(200).send(uc);
                        }).catch((e) => {
                            console.debug('Error occured while saving user check topics');
                            console.debug(e);
                            logger.error(e.stack);
                            return res.status(500).send(e);
                        });
                    } else {
                    return res.status(500).send('topics not available for selected theme');
                  }
                
            }).catch((error) => {
                logger.error(error.stack);
                return res.status(500).send('Something went wrong.' + error);
            });
          }
        });
      } catch (error) {
        logger.error(error.stack);
        return res.status(500).send(error);
      }
}

export default {
  pending,
  CreateOrUpdate,
  CreateOrUpdateCheckCustom,
  CreateOrUpdateCheckQuick,
  all,
  remove,
  updateCheck,
  addGroup,
  getUserGroup,
  removeGroup,
  completed
    // update
    // remove
};
