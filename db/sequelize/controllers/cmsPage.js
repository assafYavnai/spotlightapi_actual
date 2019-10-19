import _ from 'lodash';
import { Models, sequelize } from '../models';
import jwt from 'jsonwebtoken';
import * as config from '../constants';
const uuidv1 = require('uuid/v1');
//const bodyParser = require('body-parser');
const cmsPage = Models.cmsPageModel;
var log4js = require('log4js');
const logger = log4js.getLogger('custom');


/**
 * Get All Content
 */


export function all(req, res) {
  try{
     const token=req.headers['x-access-token'];
     console.log('check token');
        if(!token){
          return res.status(401).send({ auth: false, message: 'No token provided.' });
        }
        jwt.verify(token, config.tokenSecret, (err, decoded) => {
          if (err) {
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
          }
            // GetAll Data with login authentication
            cmsPage.findAll({order: [
              ['id', 'DESC']
          ]}).then((contentList) => {
              return res.status(200).send(contentList);
            }).catch((err) => {
              console.log(err);
              logger.error(err.stack);
              return res.status(500).send('Error in first query');
            });
        });
    }catch(error){
      logger.error(error.stack);
      console.log(error);
      return res.status(500).send(error);
    }
}

// get By UrlName

export function getByUrlName(req, res) {
  try{
        // GetAll Data with login authentication
        const token=req.headers['x-access-token'];
     console.log('check token');
        if(token==null){
         // const query = { id: req.params.id }
         const query={page_title_url : req.params.page_title_url};
         console.log("PageTitle"+query.page_title_url);
            cmsPage.findOne({where:query}).then((getContent) => {
              if(!getContent){
                return res.status(404).send("Sorry page not found");
              }
              return res.status(200).send(getContent);
            }).catch((err) => {
              console.log(err);
              logger.error(err.stack);
              return res.status(500).send('Error in first query');
        });
      }
      
    }catch(error){
      logger.error(error.stack);
      console.log(error);
      return res.status(500).send(error);
    }
}

 /**
 * Add action
 */
export function add(req, res) {
  try{
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        // const{id,title_en}=req.body;
        // console.log("what coming.."+title_en);

        var parseBody=req.body;
        // res.setHeader('Content-Type', 'text/plain')
    cmsPage.create(parseBody).then(() => {
    res.status(200).send({message:'OK',dt:new Date()});
  }).catch((err) => {
    logger.error(err.stack);
    console.log(err);
    res.status(400).send(err);
  });
})
}catch(error){
  console.log(error);
  logger.error(error.stack);
  return res.status(500).send(error);
  
}
}

/**
 * Update Action
 */
export function update(req, res) {
  try{
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        }
  const query = { id: req.params.id };
  const{title_en,title_he,content_en,content_he,is_active,page_title_url}=req.body;
  const data={title_en:title_en,title_he:title_he,content_en:content_en,content_he:content_he,is_active:is_active,page_title_url:page_title_url}

  cmsPage.update(data, { where: query }).then(() => {
      res.status(200).send({successMessage:'Updated successfully',statusCode:200});
    }).catch((err) => {
      console.log(err);
      logger.error(err.stack);
      res.status(500).send({errorMessage:'We failed to save for some reason'});
    });
})
}catch(error){
  logger.error(error.stack);
  return res.status(500).send(error);
}
}



/**
 * GetById Action
 */
export function getById(req, res) {
  try{
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        }
  const query = { id: req.params.id }
  cmsPage.findOne({ where: query }).then((contentList) => {
    return res.status(200).send(contentList);
    }).catch((err) => {
      console.log(err);
      logger.error(err.stack);
      res.status(500).send({errorMessage:'We failed to save for some reason'});
    });
})
}catch(error){
  logger.error(error.stack);
  return res.status(500).send(error);
}
}



/**
 * Delete Action
 */
export function remove(req, res) {
  try{
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        }
  const query = { id: req.params.id };
  cmsPage.destroy({ where: query }).then(() => {
      res.status(200).send({successMessage:'Removed successfully',statusCode:200});
    }).catch((err) => {
      console.log(err);
      logger.error(err.stack);
      res.status(500).send({errorMessage:'We failed to save for some reason'});
    });
})
}catch(error){
  logger.error(error.stack);
  return res.status(500).send(error);
}
}


export default {
  all,
  getById,
  add,
  update,
  remove,
  getByUrlName
};
