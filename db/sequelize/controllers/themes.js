import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { Models, sequelize } from '../models';
import * as config from '../constants';
var log4js = require('log4js');
const logger = log4js.getLogger('custom');
const ThemeCategory = Models.ThemeCategory;
const ThemeMaster = Models.ThemeMaster;

export function all(req, res) {
  try{
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    
    jwt.verify(token, config.tokenSecret, (err) => {
          if (err) {
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
          }
          ThemeCategory.findAll().then((category)=>{
                ThemeMaster.findAll({where:{Categor }})
          });
          Topic.findAll().then((topics) => {
            return res.status(200).send(topics);
          }).catch((err) => {
            console.log(err);
            logger.error(err.stack);
            return res.status(500).send('Error in first query');
          });
        });
      }catch(error){
        logger.error(error.stack);
        return res.status(500).send(error);
      }
  }

export default {
    all
  };
