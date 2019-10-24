/**
 * Routes for express app
 */
import passport from 'passport';
import unsupportedMessage from '../db/unsupportedMessage';
import { controllers, passport as passportConfig } from '../db';
import proEnquiry from '../db/sequelize/controllers/proEnquiry';
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
    app.post('/api/adminSessions', usersController.adminLogin);
    app.post('/api/users', usersController.signUp);
    app.post('/api/user/logUserInfo', usersController.logUserInfo);
    
    app.delete('/api/sessions', usersController.logout);
    app.post('/api/user/verifyotp', usersController.verifyOTP);
    app.post('/api/user/changePassword', usersController.changePassword);
    app.post('/api/user/recoveryPasswordVerifyOTP', usersController.recoveryPasswordVerifyOTP);
    app.get('/api/user/validateToken',usersController.validateToken);
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
    // app.post('/api/editThemecategory/:id',themeCategoryController.update);
  } else {
    console.warn(unsupportedMessage('topics routes'));
  }
  if (coreCheckController) {
    app.get('/api/checks', coreCheckController.all);
    app.get('/api/checks/pending', coreCheckController.pending);
    app.post('/api/checks/core/add', coreCheckController.CreateOrUpdate);
    app.delete('/api/checks/remove', coreCheckController.remove);
    app.post('/api/checks/update', coreCheckController.updateCheck);
    app.post('/api/checks/addGroup', coreCheckController.addGroup);
    app.get('/api/checks/getUserGroup', coreCheckController.getUserGroup);
    app.delete('/api/checks/removeGroup', coreCheckController.removeGroup);
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

};



