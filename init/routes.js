/**
 * Routes for express app
 */
import passport from 'passport';
import unsupportedMessage from '../db/unsupportedMessage';
import { controllers, passport as passportConfig } from '../db';
import proEnquiry from '../db/sequelize/controllers/proEnquiry';
var multer  = require('multer');
//import mailsend from '../db/sequelize/controllers/sendingMail'

const usersController = controllers && controllers.users;
const topicsController = controllers && controllers.topics;
const themeCategoryController = controllers && controllers.themecategory;
const coreCheckController = controllers && controllers.coreCheck;
const checkInvitation = controllers && controllers.checkInvitation;
const checkApplication = controllers && controllers.checkApplication;
const askproEnquiry = controllers && controllers.proEnquiry;
const cmsPageController=controllers && controllers.cmsPage;
const subscriberController = controllers && controllers.subscriber;
const customCheckController = controllers && controllers.customCheck;
const topicsMasterController = controllers && controllers.topicsMaster;
const customerController = controllers && controllers.customer;

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = '';
    if(file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if(file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if(file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
  }
});
var upload = multer({storage: storage});

export default (app) => {
  app.get('/api', (req, res, next) => {
    res.status(200).send("OK");
  });
  
//pro_Enquiry
if(askproEnquiry){
  app.post('/api/proEnquiry/add',askproEnquiry.add);
} else {
  console.warn(unsupportedMessage('users routes'));
}

//User subscriber route
if(subscriberController){
  app.post('/api/userSubscribe/add',subscriberController.add);
}

//cmsPage 
if(cmsPageController){      
  app.get('/api/cmsPage/all',cmsPageController.all);
  app.get('/api/cmsPage/getById/:id',cmsPageController.getById);
  app.get('/api/cmsPage/getbyUrlName/pages/:page_title_url',cmsPageController.getByUrlName);
  app.post('/api/cmsPage/add',cmsPageController.add);
  app.put('/api/cmsPage/update/:id',cmsPageController.update);
  app.delete('/api/cmsPage/remove/:id',cmsPageController.remove);
}else{
  console.warn(unsupportedMessage('users routes'));
}

  // user routes
  if (usersController) {
    app.post('/api/sessions', usersController.login);
    //app.post('/api/adminSessions', usersController.adminLogin);
    app.post('/api/users', usersController.signUp);
    app.post('/api/user/logUserInfo', usersController.logUserInfo);
    
    app.delete('/api/sessions/:id', usersController.logout);
    app.post('/api/user/verifyotp', usersController.verifyOTP);
    app.post('/api/user/changePassword', usersController.changePassword);
    app.post('/api/user/recoveryPasswordVerifyOTP', usersController.recoveryPasswordVerifyOTP);
    app.get('/api/user/validateToken',usersController.validateToken);
    app.delete('/api/user/remove', usersController.remove);

    app.get('/api/user/getUserList',usersController.getUserList);
    app.get('/api/user/getUserCurrentActiveChecksList',usersController.getUserByActiveChecks);
    app.get('/api/user/getUserByRecentlyCompleted',usersController.getUserByRecentlyCompleted);
    app.get('/api/user/getCurrentlyActiveUsers',usersController.getCurrentlyActiveUsers);
    
    //app.get('/api/proEnquiry',proEnquiry.Add);
  } else {
    console.warn(unsupportedMessage('users routes'));
  }

  if (passportConfig && passportConfig.google) {
    // google auth
    // Redirect the user to Google for authentication. When complete, Google
    // will redirect the user back to the application at
    // /auth/google/return
    // Authentication with google requires an additional scope param, for more info go
    // here https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
    app.get('/auth/google', passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }));

    // Google will redirect the user to this URL after authentication. Finish the
    // process by verifying the assertion. If valid, the user will be logged in.
    // Otherwise, the authentication has failed.
    app.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
      }));
  }

  // topic routes
  // if (topicsController) {
  //   app.get('/topic', topicsController.all);
  //   app.post('/topic/:id', topicsController.add);
  //   app.put('/topic/:id', topicsController.update);
  //   app.delete('/topic/:id', topicsController.remove);
  // } else {
  //   console.warn(unsupportedMessage('topics routes'));
  // }

  // theme category master Route

  if (themeCategoryController) {
    app.get('/api/themes', themeCategoryController.all);
    app.post('/api/themes/add', themeCategoryController.add);
  } else {
    console.warn(unsupportedMessage('topics routes'));
  }

  // TopicsMaster
  if(topicsMasterController){
    app.get('/api/getTopicMaster',topicsMasterController.getTopicsMaster);
    app.get('/api/getTopicCategoryList',topicsMasterController.topicsCategoryList);
    app.post('/api/addTopics',topicsMasterController.addTopics);
    app.put('/api/editTopics',topicsMasterController.editTopics);
    app.delete('/api/deleteTopics/:id',topicsMasterController.deleteTopics);
  }

  if (coreCheckController) {
    app.post('/api/checks', coreCheckController.all);
    app.post('/api/checks/completed', coreCheckController.completed);
    app.get('/api/checks/pending', coreCheckController.pending);
    app.post('/api/checks/core/add', coreCheckController.CreateOrUpdate);
    app.post('/api/checks/custom/add', coreCheckController.CreateOrUpdateCheckCustom);
    app.post('/api/checks/quick/add', coreCheckController.CreateOrUpdateCheckQuick);
    app.delete('/api/checks/remove', coreCheckController.remove);
    app.post('/api/checks/update', coreCheckController.updateCheck);
    app.post('/api/checks/addGroup', coreCheckController.addGroup);
    app.get('/api/checks/getUserGroup', coreCheckController.getUserGroup);
    app.delete('/api/checks/removeGroup', coreCheckController.removeGroup);
  }
  if(customCheckController){
    app.get('/api/checks/topicspool',customCheckController.fetchTopicsPool);
  }
  if (checkInvitation) {
    app.post('/api/check/inviteusers', checkInvitation.sendInvitation);
    app.get('/api/check/users/:check_id', checkInvitation.allInvitedUsers);
    app.post('/api/check/updateTime', checkInvitation.updateCheckInvitation);
    
  }
  console.log('checkApplication');
  console.log(checkApplication);
  if (checkApplication) {
    app.post('/api/checkapp/getTopics', checkApplication.getTopics);
    app.post('/api/checkapp/saveAnswer', checkApplication.saveAnswer);
    app.get('/api/checkapp/report/:id', checkApplication.viewReport);
  }

  // Customer
  if(customerController){
      app.post('/api/addCustomer',customerController.addCustomer);
      app.get('/api/getCustomer',customerController.getCustomer);
      app.delete('/api/customer/remove/:id',customerController.remove);
      app.put('/api/editCustomer',customerController.editCustomer);
      app.post('/api/customer/upload/:id',upload.single('file'), customerController.changePhoto);
      app.put('/api/editCustomerState',customerController.editCustomerState);
  }

};



