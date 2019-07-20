import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { Models, sequelize } from '../models';
import * as config from '../constants';
import checkInvitation from './checkInvitation';

const uuidv1 = require('uuid/v1');

const {
UserCheck, UserCheckTopics, TopicsMaster, UserCheckInvitation, UserGroups, UserGroupsEmail
} = Models;
const UserMaster = Models.User;
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
      UserCheck.findOne({where: {payment_completed: false}}).then((d) => {
        return res.status(200).send(d);
      }).catch((error) => {
        console.debug('error while fetching pending checks');
        console.debug(error);
        return res.status(500).send(error);
      });
    });
  } catch (error) {
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
      UserCheck.destroy({where: {id: req.body.id}}).then((d) => {
        if (d > 0) {
          return res.status(200).send({success: true});
        }
          res.statusMessage = 'Unable to delete. Please try again';
          return res.status(500).send({success: false});
      }).catch((error) => {
        console.debug('error while fetching pending checks');
        console.debug(error);
        return res.status(500).send(error);
      });
    });
  } catch (error) {
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
      UserMaster.findById(decoded.id).then((user) => {
        if (user.isadmin) {
          UserCheck.findAll().then((d) => {
            return res.status(200).send(d);
          }).catch((error) => {
            console.debug('error while fetching users check');
            console.debug(error);
            return res.status(500).send(error);
          });
        } else {
          UserCheck.findAll({
where: {user_id: decoded.id.toString()},
order: [
            ['id', 'DESC'],
        ]
}).then((d) => {
            console.log('User check List');
            console.log(d);
            if(d==null || d.length==0){
              return res.status(404).send({ message: 'Check not exist.' });
            }
            const data = [];
            const checks = d.map((p) => {
              return p.id;
            });
            UserCheckInvitation.findAll({
              where: {
                  user_check_id: {
                  [sequelize.Op.in]: checks
                }
              }
            }).then((i) => {
            console.log('User check invitation List');
            console.log(i);
            if(i==null || i.length==0){
              return res.status(404).send({ message: 'Check Invitation not exist.' });
            }
              sequelize.query(`SELECT a.user_check_id,count(b.id) as answered,count(b.id) as answered,(( CASE WHEN  count(a.id) >
              (SELECT count(id) FROM user_check_topics where user_check_id=a.user_check_id) then count(distinct b.user_check_topic_id::numeric ) else count(distinct a.id::numeric ) end)
              * 
              (SELECT count(1)::numeric from user_check_invitations where user_check_id=a.user_check_id)) as total ,CASE count(distinct b.user_check_topic_id::numeric ) WHEN 0 then 0 else 
              ((count(b.id::numeric))/(( CASE WHEN  count(a.id) >
                                       (SELECT count(id) FROM user_check_topics where user_check_id=a.user_check_id) then count(distinct b.user_check_topic_id::numeric ) else count(distinct a.id::numeric ) end)
                                       * 
                                       (SELECT count(1)::numeric from user_check_invitations where user_check_id=a.user_check_id)))::numeric(18,2)*100 end as topics_completed    FROM user_check_topics a
              left join user_check_topics_answers b on a.id=b.user_check_topic_id WHERE user_check_id in (${checks.toString()}) group by a.user_check_id order by user_check_id`, { type: sequelize.QueryTypes.SELECT }).then( (t) => {
               
                d.forEach((item) => {
                  const obj = item.toJSON();
                  obj.completed = parseFloat((i.filter((t) => {
                    return t.is_completed === true && t.user_check_id === obj.id;
                  }).length) / (i.filter((t) => {
                    return t.user_check_id === obj.id;
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
                return res.status(200).send(data);
          });
             
            });
          }).catch((error) => {
            console.debug('error while fetching users check');
            console.debug(error);
            return res.status(500).send(error);
          });
        }
      });
    });
  } catch (err) {
    console.log(err);
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
          if (data.id > 0) { // go for update
            delete data.tiny_url;
            UserCheck.update(data, {where: { id: data.id}}).then((uc) => {
                console.log(uc);
                console.debug('Updated check');
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
                            console.log('topics added to check');
                            console.log(t);
                            return res.status(200).send(uc);
                        }).catch((e) => {
                            console.debug('Error occured while saving user check topics');
                            console.debug(e);
                            return res.status(500).send(e);
                        });
                    } else {
                      return res.status(500).send('topics not available for selected theme');
                    }
                });
                });
            }).catch((error) => {
               return res.status(500).send('Something went wrong.' + error);
            });
          } else { // go to create new check
            data.tiny_url = uuidv1();
            UserCheck.create(data).then((uc) => {
                console.log(uc);
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
                            console.log('topics added to check');
                            console.log(t);
                            return res.status(200).send(uc);
                        }).catch((e) => {
                            console.debug('Error occured while saving user check topics');
                            console.debug(e);
                            return res.status(500).send(e);
                        });
                    } else {
                    return res.status(500).send('topics not available for selected theme');
                  }
                });
            }).catch((error) => {
                return res.status(500).send('Something went wrong.' + error);
            });
          }
        });
      } catch (error) {
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
        if (data.id > 0) { // go for update
          delete data.tiny_url;
          UserCheck.update(data, {where: { id: data.id}}).then((uc) => {
              console.log(uc);
              console.debug('Updated check');
              return res.status(200).send(uc);
          }).catch((error) => {
             return res.status(500).send('Something went wrong.' + error);
          });
        } else { // go to create new check
          return res.status(404).send('This check does not exists');
        }
      });
    } catch (error) {
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
            console.log(uc);
            console.debug('Updated group');
            UserGroupsEmail.destroy({where: {group_id: data.id}}).then((deleted) => {
              console.log('deleted emails from user groups email');
              console.log(deleted);
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
                    console.log(gc);
                    console.debug('Email added to new group');
                    groupList.push(gc);
                    if (groupList.length == emaildata.length) {
                      console.log('group id', data.id);
                      UserGroups.findAll({where: {id: data.id}}).then((gr) => {
                        console.log('group data');
                        console.log(gr);
                        return res.status(200).send([{group: gr, emailList: groupList}]);
                      }).catch((error) => {
                        return res.status(500).send('Something went wrong.' + error);
                      });
                    }
                  }).catch((error) => {
                    return res.status(500).send('Something went wrong.' + error);
                  });
                });
              }
            }).catch((error) => {
              return res.status(500).send('Something went wrong.' + error);
            });
          }).catch((error) => {
            return res.status(500).send('Something went wrong.' + error);
          });
        } else { // go to create new group
          UserGroups.findOne({ where: { group_name:data.group_name,user_id:data.user_id }}).then((existinggroup) => {
            if(existinggroup){
              return res.status(409).send({errorMessage: 'Sorry this group name already exist',status: 409});
            }
            UserGroups.create(data).then((uc) => {
              console.log(uc);
              console.debug('New group created');
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
                    console.log(gc);
                    console.debug('Email added to new group');
                    groupList.push(gc);
                    if (groupList.length == emaildata.length) {
                      return res.status(200).send([{group: uc, emailList: groupList}]);
                    }
                  }).catch((error) => {
                    return res.status(500).send('Something went wrong.' + error);
                  });
                });
              }
          }).catch((error) => {
              return res.status(500).send('Something went wrong.' + error);
          });
          }).catch((error) => {
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
              return res.status(500).send('Something went wrong.' + error);
            });
        } else {
          return res.status(404).send('Email groups not created yet.');
        }
      }).catch((error) => {
        return res.status(500).send('Something went wrong.' + error);
      });
    });
  } catch (err) {
    console.log(err);
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
            console.debug(error);
            return res.status(500).send(error);
          });
        }
      }).catch((error) => {
        console.debug('error while fetching pending checks');
        console.debug(error);
        return res.status(500).send(error);
      });
    });
}

export default {
  pending,
  CreateOrUpdate,
  all,
  remove,
  updateCheck,
  addGroup,
  getUserGroup,
  removeGroup
    // update
    // remove
};
