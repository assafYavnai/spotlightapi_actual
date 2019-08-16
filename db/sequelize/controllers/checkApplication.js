import _ from 'lodash';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Axios from 'axios';
import { Models, sequelize } from '../models';
import * as config from '../constants';
import moment from 'moment';
import {message} from '../../../config/constants';
const uuidv1 = require('uuid/v1');

const UserCheckTopic = Models.UserCheckTopics;
const UserMaster = Models.User;
const UserCheckInvitation = Models.UserCheckInvitation;
const UserCheckMaster = Models.UserCheck;
const TopicsAnswer = Models.TopicsAnswer;
const ReportSharableLink=Models.ReportSharableLinkModel;
/**
 * @api {post} /api/checkapp/getTopics Fetch all topics and check inforamtion.
 * @apiName getTopics
 * @apiGroup CheckApplication
 * @apiParam {String} checkUniqueId Uniqe ID genereted for CheckApplication.
 * @apiParam {String} userId Uniqe ID genereted for invited user.
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
    "invitation": {
        "current_topic": 0,
        "email": "munna@ferventsoft.com",
        "is_completed": false
    },
    "check": {
        "id": 7,
        "user_id": "15",
        "check_master_code": "CORE",
        "theme_id": 2,
        "name_en": "first core check",
        "description_en": null,
        "name_he": null,
        "description_he": null,
        "is_active": true,
        "payment_completed": true,
        "start_date": "2019-06-04T18:30:00.000Z",
        "end_date": "2019-06-10T18:30:00.000Z",
        "tiny_url": "ffdsfdsffsf-fdsfdsf-fsdfsdfsf-fdsfsd",
        "phone": "9268310732",
        "email": "munna@ferventsoft.com",
        "created_on": null,
        "updated_on": null,
        "conclusion": null,
        "is_pro_report_ready": false,
        "createdAt": "2019-06-03T07:21:29.287Z",
        "updatedAt": "2019-06-03T07:21:29.287Z"
    },
    "topics": [
        {
            "id": 100,
            "user_check_id": 7,
            "user_id": "15",
            "topic_category_id": 10,
            "text_en": "Does your team have business/management knowledge and capabilities? Please refer to the team you are part of and not the team that you manage",
            "text_he": null,
            "is_active": true,
            "analysis": null,
            "pro_score": null,
            "createdAt": "2019-06-03T08:19:35.675Z",
            "updatedAt": "2019-06-03T08:19:35.675Z"
        },
        {
            "id": 101,
            "user_check_id": 7,
            "user_id": "15",
            "topic_category_id": 10,
            "text_en": "How is the communication and relationships with our team? Please refer to the team you are part of and not the team that you manage",
            "text_he": null,
            "is_active": true,
            "analysis": null,
            "pro_score": null,
            "createdAt": "2019-06-03T08:19:35.675Z",
            "updatedAt": "2019-06-03T08:19:35.675Z"
        },
        {
            "id": 102,
            "user_check_id": 7,
            "user_id": "15",
            "topic_category_id": 10,
            "text_en": "Does your organization have enough resources and focus to meet long term gains and planning?",
            "text_he": null,
            "is_active": true,
            "analysis": null,
            "pro_score": null,
            "createdAt": "2019-06-03T08:19:35.675Z",
            "updatedAt": "2019-06-03T08:19:35.675Z"
        },
        {
            "id": 103,
            "user_check_id": 7,
            "user_id": "15",
            "topic_category_id": 10,
            "text_en": "Does your organization provide enviable motivation to work in a team environment?",
            "text_he": null,
            "is_active": true,
            "analysis": null,
            "pro_score": null,
            "createdAt": "2019-06-03T08:19:35.675Z",
            "updatedAt": "2019-06-03T08:19:35.675Z"
        },
        {
            "id": 104,
            "user_check_id": 7,
            "user_id": "15",
            "topic_category_id": 10,
            "text_en": "How do we perform as a team? Please refer to the team that you are part of and not to the team that you manage",
            "text_he": null,
            "is_active": true,
            "analysis": null,
            "pro_score": null,
            "createdAt": "2019-06-03T08:19:35.675Z",
            "updatedAt": "2019-06-03T08:19:35.675Z"
        }
    ]
}
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Error
 *     HTTP/1.1 404 Error
 */
export function getTopics(req, res) {
  try {
      console.log('getTopics Called');
      const { checkUniqueId, userId } = req.body;
      let data = {};
      let errorData={name:'N/A',company_name:'N/A',status:'N/A',start_date:'N/A',end_date:'N/A',initiator:'N/A'};
      UserCheckInvitation.findOne({where: {uniqe_id: userId}}).then((invitaiton) => {
          data.invitation = {};
          if(invitaiton!=null){
                if(invitaiton.is_completed !== true){
                data.invitation.current_topic = invitaiton.current_topic;
                data.invitation.current_time = invitaiton.current_time;
                data.invitation.email = invitaiton.email;
                data.invitation.is_completed = invitaiton.is_completed;
              }
              else {
              
                errorData.status = 'finished';
              
                errorData.message = message.CHECK_COMPLETED;
              }
            
          } else {
            errorData.status='not invited to you';
            errorData.message= message.INVALID_CHECK_INVITATION;
         
          }
        
        UserCheckInvitation.update({
            is_accepted: true}, {where: {uniqe_id: userId}}).then((u) => {
              
              UserCheckMaster.findOne({
                where: {
                tiny_url: checkUniqueId,
                is_active: true,
                start_date: { [sequelize.Op.lt]: sequelize.fn('NOW')},
                end_date: { [sequelize.Op.gt]: sequelize.fn('NOW')},
            }
        }).then((item) => {
                if (item !== null && item.id > 0 && Object.keys(data.invitation).length > 0 ) {
                 const check = item.toJSON();
                 data ={...data, check};
                 data.topics = [];

                 UserMaster.findOne({where:{id:check.user_id}}).then((u)=>{
                    if(u!=null){
                        data.company_name=u.company_name;
                    } 
                    UserCheckTopic.findAll({where: {user_check_id: check.id}, order: [
                        ['id', 'ASC']
                    ]}).then((topics) => {
                        topics.forEach((t) => {
                           data.topics.push(t.toJSON());
                        });
                      return res.status(200).send(data);
                    });
                 });
                 
                } else {
                    UserCheckMaster.findOne({
                        where: {
                        tiny_url: checkUniqueId,
                        is_active: true
                    }}).then( (p)=>{
                        var uid=p!=null?p.user_id:0;
                        var dt=new Date();
                        var sdt= new Date(p.start_date);
                        var edt= new Date(p.end_date);
                       UserMaster.findOne({where:{id:uid}}).then((u)=>{
                            if(u!=null){
                                errorData.company_name=u.company_name;
                                errorData.initiator= u.first_name;
                            } 
                            if(p==null) {
                                errorData.status='invalid';
                                errorData.message = message.CHECK_INVALID;
                            } else if(  (new Date(p.start_date))> dt){
                                errorData.status='not Started';
                                errorData.message = message.CHECK_NOT_STARTED.replace('[DATETIME]',moment(sdt).format('DD/MM/YYYY HH:mm:ss'));
                            } else if(  (new Date(p.end_date)) <dt){
                                errorData.status='expired';
                                errorData.message = message.CHECK_HAS_EXPIRED.replace('[DATETIME]',moment(edt).format('DD/MM/YYYY HH:mm:ss'));
                            } else if(p.is_active==false){
                                errorData.status='canceled';
                            } else{
                               errorData.message = 'Something went wrong';
                            }
                            if(p!=null){
                                errorData.name = p.name_en || p.name_he;
                                errorData.start_date = sdt;//moment(sdt).format('DD/MM/YYYY HH:mm:ss');
                                errorData.end_date = edt;//moment(edt).format('DD/MM/YYYY HH:mm:ss');
                            }
                            throw Error('Data Error');
                         }).catch( (es)=>{
                            return res.status(200).send({error:errorData,dt:new Date()});
                         });
                        
                    }).catch( (err)=>{
                        console.log(err);
                        return res.status(200).send({error:errorData,dt:new Date()});
                    });
                    
                }
              }).catch((err) => {
                res.statusMessage = err.message;
               return res.status(200).send({error:{msg:err.message},dt:new Date()});
            });
          }).catch((err) => {
            res.statusMessage = err.message;
            return res.status(200).send({error:{msg:err.message},dt:new Date()});
          });
      }).catch((err) => {
        res.statusMessage = err.message;
        return res.status(200).send({error:{msg:err.message},dt:new Date()});
    });
      
  } catch (error) {
    res.statusMessage = error.message;
    return res.status(200).send({error:{msg:error.message},dt:new Date()});
  }
}
/** 
 * @api {post} /api/checkapp/saveAnswer Save Topic Answer
 * @apiName saveAnswer
 * @apiGroup CheckApplication
 * @apiParam {String} checkUniqueId Uniqe ID genereted for CheckApplication.
 * @apiParam {String} userId Uniqe ID genereted for invited user.
 * @apiParam {String} topicId Answered topic ID.
 * @apiParam {String} answer comments provided on topic.
 * @apiParam {String} option selected option by user.
 * @apiParam {Number} takenTime used time to answer this topic.
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Error
 *     HTTP/1.1 404 Error
 */
export function saveAnswer(req, res,next) {
    try {
        const {
checkUniqueId, topicId, userId, answer, option, takenTime
} = req.body;
        UserCheckMaster.findOne({where: {tiny_url: checkUniqueId}}).then((check) => {
            UserCheckInvitation.findAndCount({where: {uniqe_id: userId, user_check_id: check.id}}).then((u) => {
                if (u.count > 0) {
                    TopicsAnswer.create({
                        user_check_topic_id: topicId,
                        user_id: userId,
                        answer,
                        choosen_option: option,
                        taken_time: takenTime,
                        is_hilighted_answer: false
                    }).then((response) => {
                        UserCheckInvitation.update({
                            current_topic: sequelize.literal('current_topic + 1'),
                            current_time: 0
                          }, {where: {uniqe_id: userId}}).then((result) => {

                          });
                        res.status(200).send('OK');
                    }).catch((error) => {
                        res.status(500).send(error);
                    });
                }
            }).catch((err) => {
                console.log(err);
                res.status(500).send(err);
            });
        });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  /**
 * @api {post} /api/checkapp/report/:id Generate Report for provided checkID.
 * @apiName ViewReport
 * @apiGroup CheckApplication
 * @apiParam {String} id id of created check.
 *  @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * {
    "id": 7,
    "user_id": "15",
    "check_master_code": "CORE",
    "theme_id": 2,
    "name_en": "first core check",
    "description_en": null,
    "name_he": null,
    "description_he": null,
    "is_active": true,
    "payment_completed": true,
    "start_date": "2019-06-04T18:30:00.000Z",
    "end_date": "2019-06-08T18:30:00.000Z",
    "tiny_url": "ffdsfdsffsf-fdsfdsf-fsdfsdfsf-fdsfsd",
    "phone": "9268310732",
    "email": "munna@ferventsoft.com",
    "created_on": null,
    "updated_on": null,
    "conclusion": null,
    "is_pro_report_ready": false,
    "createdAt": "2019-06-03T07:21:29.287Z",
    "updatedAt": "2019-06-03T07:21:29.287Z",
    "count": "4",
    "optiona": "50",
    "optionb": "50",
    "optionc": "0",
    "topics": [
        {
            "id": 100,
            "user_check_id": 7,
            "user_id": "15",
            "topic_category_id": 10,
            "text_en": "Does your team have business/management knowledge and capabilities? Please refer to the team you are part of and not the team that you manage",
            "is_active": true,
            "analysis": null,
            "pro_score": null,
            "createdAt": "2019-06-03T08:19:35.675Z",
            "updatedAt": "2019-06-03T08:19:35.675Z",
            "text_he": null,
            "total_answer": "1",
            "optiona": "100",
            "optionb": "0",
            "optionc": "0",
            "comments": [
                {
                    "id": 1,
                    "user_check_topic_id": 100,
                    "user_id": "88bbf701-8828-11e9-9ae4-19f92fecea53",
                    "answer": "Testing Answer",
                    "choosen_option": "A",
                    "taken_time": 15,
                    "is_hilighted_answer": false,
                    "createdAt": "2019-06-06T12:53:53.070Z",
                    "updatedAt": "2019-06-06T12:53:53.070Z"
                }
            ]
        },
        {
            "id": 101,
            "user_check_id": 7,
            "user_id": "15",
            "topic_category_id": 10,
            "text_en": "How is the communication and relationships with our team? Please refer to the team you are part of and not the team that you manage",
            "is_active": true,
            "analysis": null,
            "pro_score": null,
            "createdAt": "2019-06-03T08:19:35.675Z",
            "updatedAt": "2019-06-03T08:19:35.675Z",
            "text_he": null,
            "total_answer": "2",
            "optiona": "50",
            "optionb": "50",
            "optionc": "0",
            "comments": [
                {
                    "id": 3,
                    "user_check_topic_id": 101,
                    "user_id": "88bbf701-8828-11e9-9ae4-19f92fecea53",
                    "answer": "Testing Answer",
                    "choosen_option": "B",
                    "taken_time": 15,
                    "is_hilighted_answer": false,
                    "createdAt": "2019-06-06T13:27:52.649Z",
                    "updatedAt": "2019-06-06T13:27:52.649Z"
                },
                {
                    "id": 5,
                    "user_check_topic_id": 101,
                    "user_id": "88bbf701-8828-11e9-9ae4-19f92fecea53",
                    "answer": "Testing Answersa",
                    "choosen_option": "A",
                    "taken_time": 23,
                    "is_hilighted_answer": true,
                    "createdAt": "2019-06-06T13:27:52.649Z",
                    "updatedAt": "2019-06-06T13:27:52.649Z"
                }
            ]
        },
        {
            "id": 102,
            "user_check_id": 7,
            "user_id": "15",
            "topic_category_id": 10,
            "text_en": "Does your organization have enough resources and focus to meet long term gains and planning?",
            "is_active": true,
            "analysis": null,
            "pro_score": null,
            "createdAt": "2019-06-03T08:19:35.675Z",
            "updatedAt": "2019-06-03T08:19:35.675Z",
            "text_he": null,
            "total_answer": "1",
            "optiona": "0",
            "optionb": "100",
            "optionc": "0",
            "comments": [
                {
                    "id": 2,
                    "user_check_topic_id": 102,
                    "user_id": "88bbf701-8828-11e9-9ae4-19f92fecea53",
                    "answer": "Testing Answer",
                    "choosen_option": "B",
                    "taken_time": 15,
                    "is_hilighted_answer": false,
                    "createdAt": "2019-06-06T13:27:45.511Z",
                    "updatedAt": "2019-06-06T13:27:45.511Z"
                }
            ]
        }
    ]
*}
 */
  export function viewReport(req,res) {
     var id= parseInt(req.params.id);
     if(req.params.id.length<10){
         viewAdminReport(req,res);
     } else {
        ShowUserReport(req,res);
     }
  }
   function viewAdminReport(req, res) {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).send({ auth: false, message: 'No token provided.' });
        }
        jwt.verify(token, config.tokenSecret, (err, decoded) => {
            if (err) {
                return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
            }
            console.log(req.params);
            let data = {};
            sequelize.query(`SELECT distinct c.*,min(d.tiny_url) as sharable_link,u.company_name,count(distinct i.id) as participants, 
            round((SUM(CASE i.is_completed WHEN true THEN 1 else 0 end )::numeric/count(i.*))*100,2)::numeric  completed, count(tbl.*),
            round((SuM(case tbl.choosen_option WHEN 'A' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optiona,
            round((SuM(case tbl.choosen_option WHEN 'B' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionb,
            round((SuM(case tbl.choosen_option WHEN 'C' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionc,
            round((SuM(case tbl.choosen_option WHEN 'Not answered' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionna FROM user_checks c  inner join  
            (SELECT a.*,t.user_check_id FROM user_check_topics_answers a 
            inner join user_check_topics t on a.user_check_topic_id=t.id) tbl
            left join user_check_invitations i on tbl.user_check_id=i.user_check_id 
            on c.id=tbl.user_check_id 
            inner join users u on c.user_id::integer=u.id left join report_sharable_links d on d.user_check_id=tbl.user_check_id   WHERE c.id=? and c.user_id=?::character varying group by c.id,u.company_name`, { type: sequelize.QueryTypes.SELECT, replacements: [req.params.id,decoded.id]}).then((summary) => {
                if (summary != null && summary.length > 0) {
                    data = summary[0];
                    if(data.sharable_link=="0" || data.sharable_link=="" || data.sharable_link==null){
                        // Generate 50 character String random unique id and make entry for Report_Sharable link
                const stringUniqueId=(length)=> {
                    var result = '';
                    var characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    var charactersLength = characters.length;
                    for ( var i = 0; i < length; i++ ) {
                       result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    return result;
                 }
                  const uniqueId=stringUniqueId(50);
                  data.sharable_link = uniqueId;
                  const reportData={user_check_id:req.params.id,tiny_url:uniqueId};
                    ReportSharableLink.create(reportData).then(()=>{
                   //res.status(200).send('OK');
                   console.log("report Sharable link created");
                 }).catch((err) => {
                  console.log(err);
                  //res.status(400).send(err);
                });
                    }
                    sequelize.query(`SELECT distinct c.*, count(tbl.*) as total_answer,
                    round((SuM(case tbl.choosen_option WHEN 'A' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optiona,
                    round((SuM(case tbl.choosen_option WHEN 'B' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionb,
                    round((SuM(case tbl.choosen_option WHEN 'C' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionc,
                    round((SuM(case tbl.choosen_option WHEN 'Not answered' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionna FROM user_check_topics c
                    inner join 
                    (SELECT a.* FROM user_check_topics_answers a 
                    inner join user_check_topics t on a.user_check_topic_id=t.id) tbl on tbl.user_check_topic_id=c.id 
                    WHERE c.user_check_id=?   group by c.id order by c.id`, { type: sequelize.QueryTypes.SELECT, replacements: [req.params.id]}).then((topics) => {
                        
                        if (topics.length > 0) {
                            
                            const topicsId = topics.map((item) => {
                            return item.id;
                            });
                            TopicsAnswer.findAll({
                                where: {
                                    user_check_topic_id: {
                                    [sequelize.Op.in]: topicsId
                                }
                                }
                            }).then((comments) => {
                                data.topics = topics.map((t) => {
                                    const topic = t;
                                    topic.comments = comments.filter((c) => {
                                        return c.user_check_topic_id === t.id;
                                    });
                                    return topic;
                                });
                                res.status(200).send(data);
                            }).catch((err) => {
                                return res.status(500).send('Error while fetching comments');
                            });
                        }
                    });
                } else { 
                    return res.status(404).send('Not Found');
                }
            });
        });
    } catch (error) {
        return res.status(500).send(error);
    }
  }
   function ShowUserReport(req, res) {
    try {

            let data = {};
            sequelize.query(`SELECT distinct c.*, u.company_name,count(distinct i.id) as participants, 
            round((SUM(CASE i.is_completed WHEN true THEN 1 else 0 end )::numeric/count(i.*))*100,2)::numeric  completed, count(tbl.*),
            round((SuM(case tbl.choosen_option WHEN 'A' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optiona,
            round((SuM(case tbl.choosen_option WHEN 'B' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionb,
            round((SuM(case tbl.choosen_option WHEN 'C' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionc,
            round((SuM(case tbl.choosen_option WHEN 'Not answered' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionna FROM user_checks c  inner join  
            (SELECT a.*,t.user_check_id FROM user_check_topics_answers a 
            inner join user_check_topics t on a.user_check_topic_id=t.id) tbl
            left join user_check_invitations i on tbl.user_check_id=i.user_check_id 
            on c.id=tbl.user_check_id 
            inner join users u on c.user_id::integer=u.id inner join report_sharable_links d on d.user_check_id =tbl.user_check_id   WHERE d.tiny_url=? group by c.id,u.company_name`, { type: sequelize.QueryTypes.SELECT, replacements: [req.params.id]}).then((summary) => {
                if (summary != null && summary.length > 0) {
                    data = summary[0];
                    
                    sequelize.query(`SELECT distinct c.*, count(tbl.*) as total_answer,
                    round((SuM(case tbl.choosen_option WHEN 'A' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optiona,
                    round((SuM(case tbl.choosen_option WHEN 'B' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionb,
                    round((SuM(case tbl.choosen_option WHEN 'C' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionc,
                    round((SuM(case tbl.choosen_option WHEN 'Not answered' THEN 1 else 0 end)/count(tbl.*)::numeric)*100,2)::numeric optionna FROM user_check_topics c
                    inner join 
                    (SELECT a.* FROM user_check_topics_answers a 
                    inner join user_check_topics t on a.user_check_topic_id=t.id) tbl on tbl.user_check_topic_id=c.id 
                    WHERE c.user_check_id=?   group by c.id order by c.id`, { type: sequelize.QueryTypes.SELECT, replacements: [data.id]}).then((topics) => {
                        
                        if (topics.length > 0) {
                            
                            const topicsId = topics.map((item) => {
                            return item.id;
                            });
                            TopicsAnswer.findAll({
                                where: {
                                    user_check_topic_id: {
                                    [sequelize.Op.in]: topicsId
                                }
                                }
                            }).then((comments) => {
                                data.topics = topics.map((t) => {
                                    const topic = t;
                                    topic.comments = comments.filter((c) => {
                                        return c.user_check_topic_id === t.id;
                                    });
                                    return topic;
                                });
                                res.status(200).send(data);
                            }).catch((err) => {
                                return res.status(500).send('Error while fetching comments');
                            });
                        }
                    });
                } else { 
                    return res.status(404).send('Not Found');
                }
            });
    } catch (error) {
        return res.status(500).send(error);
    }
  }


export default {
    getTopics,
    saveAnswer,
    viewReport
    // update
    // remove
  };
