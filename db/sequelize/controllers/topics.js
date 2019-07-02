import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { Models, sequelize } from '../models';
import * as config from '../constants';

const Topic = Models.Topic;

/**
 * List
 */
export function all(req, res) {
  try{
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, config.tokenSecret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        
        Topic.findAll().then((topics) => {
          return res.status(200).send(topics);
        }).catch((err) => {
          console.log(err);
          return res.status(500).send('Error in first query');
        });
      });

    }catch(error){
      return res.status(500).send(error);
    }
}

/**
 * Add a Topic
 */
export function add(req, res) {
  try{
  Topic.create(req.body).then(() => {
    res.status(200).send('OK');
  }).catch((err) => {
    console.log(err);
    res.status(400).send(err);
  });
}catch(error){
  return res.status(500).send(error);
}
}

/**
 * Update a topic
 */
export function update(req, res) {
  try{
  const query = { id: req.params.id };
  const isIncrement = req.body.isIncrement;
  const isFull = req.body.isFull;
  const omitKeys = ['id', '_id', '_v', 'isIncrement', 'isFull'];
  const data = _.omit(req.body, omitKeys);

  if (isFull) {
    Topic.update(data, { where: query }).then(() => {
      res.status(200).send('Updated successfully');
    }).catch((err) => {
      console.log(err);
      res.status(500).send('We failed to save for some reason');
    });
  } else {
    const sign = isIncrement ? '+' : '-';
    Topic.update({
      count: sequelize.literal(`count${sign}1`)
    }, { where: query }).then(() => {
      res.status(200).send('Updated successfully');
    }).catch((err) => {
      console.log(err);
      // Not sure if server status is the correct status to return
      res.status(500).send('We failed to save for some reason');
    });
  }
}catch(error){
  return res.status(500).send(error);
}
}

/**
 * Remove a topic
 */
export function remove(req, res) {
  try{
  Topic.destroy({ where: { id: req.params.id } }).then(() => {
    res.status(200).send('Removed Successfully');
  }).catch((err) => {
    console.log(err);
    res.status(500).send('We failed to delete for some reason');
  });
}catch(error){
  return res.status(500).send(error);
}
}

export default {
  all,
  add,
  update,
  remove
};
