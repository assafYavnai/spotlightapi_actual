import _ from 'lodash';
import { Models, sequelize } from '../models';

const ThemeCategory = Models.ThemeCategory;
const Theme = Models.ThemeMaster;
const Topics = Models.TopicsMaster;
const TopicCategoryMaster= Models.TopicCategoryMaster;

/**
 * @api {get} /api/themes Request Theme information including category and topics.
 * @apiName AllTheme
 * @apiGroup Theme
 * @apiHeader {String} x-access-token require latest acces token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
          {
              "categoryName":"Human Resource",
              "categoryID":9,
              "themes":[
                {
                    "id":2,
                    "category_id":9,
                    "name_en":"theme2",
                    "description_en":null,
                    "name_he":null,
                    "description_he":null,
                    "is_active":null,
                    "createdAt":"2019-05-31T15:20:48.460Z",
                    "updatedAt":"2019-05-31T15:20:48.460Z",
                    "topics":[
                      {
                          "id":6,
                          "theme_id":2,
                          "topic_category_id":10,
                          "name_en":"Does your team have business/management knowledge and capabilities? Please refer to the team you are part of and not the team that you manage",
                          "description_en":null,
                          "name_he":null,
                          "description_he":null,
                          "is_active":true,
                          "createdAt":"2019-05-30T14:02:47.916Z",
                          "updatedAt":"2019-05-30T14:02:47.916Z"
                      },
                      {
                          "id":7,
                          "theme_id":2,
                          "topic_category_id":10,
                          "name_en":"How is the communication and relationships with our team? Please refer to the team you are part of and not the team that you manage",
                          "description_en":null,
                          "name_he":null,
                          "description_he":null,
                          "is_active":true,
                          "createdAt":"2019-05-30T14:02:59.714Z",
                          "updatedAt":"2019-05-30T14:02:59.714Z"
                      },
                      {
                          "id":8,
                          "theme_id":2,
                          "topic_category_id":10,
                          "name_en":"Does your organization have enough resources and focus to meet long term gains and planning?",
                          "description_en":null,
                          "name_he":null,
                          "description_he":null,
                          "is_active":true,
                          "createdAt":"2019-05-30T14:03:11.444Z",
                          "updatedAt":"2019-05-30T14:03:11.444Z"
                      },
                      {
                          "id":9,
                          "theme_id":2,
                          "topic_category_id":10,
                          "name_en":"Does your organization provide enviable motivation to work in a team environment?",
                          "description_en":null,
                          "name_he":null,
                          "description_he":null,
                          "is_active":true,
                          "createdAt":"2019-05-30T14:05:32.306Z",
                          "updatedAt":"2019-05-30T14:05:32.306Z"
                      },
                      {
                          "id":10,
                          "theme_id":2,
                          "topic_category_id":10,
                          "name_en":"How do we perform as a team? Please refer to the team that you are part of and not to the team that you manage",
                          "description_en":null,
                          "name_he":null,
                          "description_he":null,
                          "is_active":true,
                          "createdAt":"2019-05-30T14:05:50.468Z",
                          "updatedAt":"2019-05-30T14:05:50.468Z"
                      }
                ]
            }
      ]
   }
]
 *
 * @apiError ThemesNotFound Themes are not avaialble.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ThemesNotFound"
 *     }
 */
 function all(req, res) {
   try{
  let categoryList = [];
  let themeList = [];
  let topicList = [];
  let TopicCategoryList=[];
  // topicList
  // let themeName=[];
  const categories1 = [];
  let themeData = [];
  // List of theme category master
  ThemeCategory.findAll().then((categories) => {
   categoryList = categories;
   // List of themeList
  Theme.findAll({ order: [
    ['id', 'ASC'],
]}).then((themes) => {
    themeList = themes;
    // topics
   TopicCategoryMaster.findAll().then((tc)=>{
    TopicCategoryList=tc;
    
   Topics.findAll().then((topics) => {
    topicList = topics;
    categoryList.forEach((cat) => {
      themeData = themeList.filter((p) => {
        return (p.category_id == cat.id);
      });
      const themesWithTopics = themeData.map((item) => {
        const t = item.toJSON();
        let filteritem = topicList.filter((p) => {
          return p.theme_id === item.id;
        });
        let topics = filteritem.map((d) => {
          let obj =  d.toJSON();
          const topic_Cat=TopicCategoryList.filter((tp) => {
            return (d.topic_category_id === tp.id);
          })[0];
          obj.category_en = topic_Cat.name_en;
          obj.category_he = topic_Cat.name_he;
          return obj;
        });
        t.topics = topics;
        
        return t;
      });
      categories1.push({name_en: cat.name_en, name_he: cat.name_he, categoryID: cat.id, themes: themesWithTopics});
     
    });

  res.json(categories1);
  }).catch((err) => {
    console.log(err);
    res.status(500).send('Error in first query');
  });
});
   // console.log(categories1);
  }).catch((err) => {
    console.log(err);
  });
   }).catch((error) => {
     console.log(error);
   });

  }catch(error){
    return res.status(500).send(error);
  }
}
   function add(req, res) {
     try{
    ThemeCategory.create(req.body).then(() => {
      res.status(200).send({
          successMessage: 'Record inserted successfully!',
          statusMess: 'OK'
        });
    }).catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
  }catch(error){
    return res.status(500).send(error);
  }
}

//


export default {
    all,
    add,
    // update
    // remove
  };
