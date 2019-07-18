import { ENV } from '../../config/env';
import sequelizeConfig from './sequelize_config';

const config = ENV ==='production'? sequelizeConfig.production : sequelizeConfig.development;
export const tokenSecret = 'fss!@#123psd';
export const db = process.env[config.use_env_variable] || `${config.dialect}://${config.username}:${config.password}@${config.host}/${config.database}`;

export default {
  db
};
