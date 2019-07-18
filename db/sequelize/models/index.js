import Sequelize from 'sequelize';
import sequelizeConfig from '../sequelize_config';
import { ENV } from '../../../config/env';
import tokenModel from './tokens';
import topicModel from './topics';
import userModel from './users';
import themecatModel from './theme_category_master';
import themeModel from './theme_master';
import topicsModel from './topics_master';
import userCheckModel from './user_check';
import userCheckInvitationModel from './user_check_invitation';
import userCheckTopicsModel from './user_check_topics';
import otpSchemaModel from './otpschema';
import TopicCategoryMasterModel from './topics_category_master';
import TopicsAnswerModel from './user_check_topics_answer';
import UserGroupsModel from './user_groups';
import UserGroupsEmailsModel from './user_groups_email';
import proEnquiryModel from './pro_enquiry';
const config = ENV ==='production'? sequelizeConfig.production : sequelizeConfig.development;

const db = {};
const dbUrl = process.env[config.use_env_variable];

const sequelize = dbUrl ? new Sequelize(dbUrl) : new Sequelize(config.database, config.username, config.password, config);

db.Token = sequelize.import('Token', tokenModel);
db.Topic = sequelize.import('Topic', topicModel);
db.User = sequelize.import('User', userModel);
db.ThemeCategory = sequelize.import('Theme', themecatModel);
db.ThemeMaster = sequelize.import('ThemeMaster', themeModel);
db.TopicsMaster = sequelize.import('TopicsMaster', topicsModel);
db.UserCheck = sequelize.import('UserCheck', userCheckModel);
db.UserCheckInvitation = sequelize.import('UserCheckInvitation', userCheckInvitationModel);
db.UserCheckTopics = sequelize.import('UserCheckTopics', userCheckTopicsModel);
db.OTPSchema = sequelize.import('otpSchema', otpSchemaModel);
db.TopicCategoryMaster = sequelize.import('TopicCategoryMaster', TopicCategoryMasterModel);
db.TopicsAnswer = sequelize.import('TopicsAnswer', TopicsAnswerModel);
db.UserGroups=sequelize.import('UserGroups',UserGroupsModel);
db.UserGroupsEmail=sequelize.import('UserGroupsEmail',UserGroupsEmailsModel);
db.proEnquiryModel=sequelize.import('ProEnquiry',proEnquiryModel);
Object.keys(db).forEach((key) => {
  const model = db[key];
  if (model.associate) {
    model.associate(db);
  }
});

export { db as Models, sequelize };

