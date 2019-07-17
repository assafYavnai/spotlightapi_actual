 const mailer = require('express-mailer');


const envVars = require('../config/env');
 import path from 'path';
 import { Models, sequelize } from '../db/sequelize/models';
// mailer = require('express-mailer');
const OTPSchema = Models.OTPSchema;
const User = Models.User;
  module.exports = (app, db) => {
    mailer.extend(app, {
  from: envVars.SMTP_FROM,
  host: envVars.SMTP_HOST,
  secureConnection: true,
  port: envVars.SMTP_PORT,
  transportMethod: 'SMTP',
  
  auth: {
    user: envVars.SMTP_USERNAME,
    pass: envVars.SMTP_PASSWORD
  }
});
//app.set('views', path.dirname('../') + '/views');
app.set('views', path.dirname('../') + '/views');
app.set('view engine', 'jade');

app.post('/api/sendEmail', (req, res, next) => {
  console.log(req.body.to);
    app.mailer.send('email', {
    to: req.body.to,
    subject: 'Reset Your Oracle Account Password',
     otherProperty: 'Other Property'
  }, (err) => {
    if (err) {
      res.send({errorMessage:'There was an error sending the email',errorInfo:err});
      return;
    }
    res.send({successMessage:'Email has been sent',status:200});
  });
});
app.post('/api/forgotPassword', (req, res, next) => {
  app.mailer.send('forgotPassword', {
    to: req.body.to,
    subject: 'Reset Your Growths-Map Account Password',
     name: req.body.name
  }, (err) => {
    if (err) {
      res.json({message: 'There was an error while sending the email', success: false});
    }
    res.json({message: 'Please check email in your inbox.', success: true});
  });
});

/**
 * @api {POST} /api/sendOTP Send OTP to email
 * @apiName SendOTP
 * @apiGroup User
 * @apiParam {String} email require email to provide OTP.
 * @apiDescription This API is created to send OTP on email.
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 * {
    "successMessage": "OTP has been sent on your email",
    "status": 200
  }
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 NotFound
 */
app.post('/api/sendOTP', (req, res) => {
     console.log(db);
    const {email,name} = req.body;
    User.findOne({ where: { email } }).then((existingUser) => {
     // var fullName=existingUser.first_name;
      if (existingUser) {
        return res.status(409).send({errorMessage: 'Sorry this user already exist',status: 409});
      }
    
    const otp  = Math.floor(100000 + Math.random() * 900000);
      const obj = {email, otp};
    OTPSchema.create(obj).then(() => {
      app.mailer.send('otp', {
      to: email,
      subject: 'Your One Time Password(OTP) from Spotlight ',
      otherProperty: 'Other Property',
      data: {greet: 'Hi '+name+',', OTP: otp}
      }, (err) => {
          if (err) {
              res.status(500).send({errorMessage: 'otpError', errorInfo: err});
              return;
          }
          res.status(200).send({successMessage: 'otpSentSuccess', status: 200});
      });
    })
  }).catch((error) => {
      res.status(500).send('Exception throwing' + error);
  });
});

// send verification mail...
app.post('/api/SendEmailVerfication', (req, res) => {
    const {name, link} = req.body;
    app.mailer.send('emailVerification', {

        to: req.body.to,
        subject: 'Email Veryfication ',
        greet: 'Hi!,' + name + '',
        body: link

    }, (error) => {
        if (error) {
            res.send({errorMessage: 'There was an error sending the email', erorInfo: error});
        }
        res.send({successMessage: 'Email has been sent for Verification', status: 200});
    });
});


// send success registration...
app.post('/api/SuccessRegistraion', (req, res, next) => {
    const name = req.body.name;
    app.mailer.send('registrationSuccess', {
        to: req.body.to,
       // cc:req.body.cc,
        subject: 'Registration Success ',
        greet: 'Hi!,' + name + '',
        message: 'You have successfully registered! Thanks'

    }, (error) => {
        if (error) {
            res.send({errorMessage: 'There was an error sending the email', erorInfo: error});
        }
        res.send({successMessage: 'Email has been sent for Verification', status: 200});
    });
});

// send Invitation multiple users...
app.post('/api/sendInvitation', (req, res, next) => {
  try{
    const {email, code, check_code,host, customMessage, checkName,firstName,lastName,participant,dueDate} = req.body;
    app.mailer.send('sendInvitation', {
        to: email,
        subject: 'You Are Invited to Spotlight Check',
        data: {email, code, check_code,host, customMessage, checkName,firstName,lastName,participant,dueDate}

    }, (error) => {
      console.log(error);
        if (error) {
            res.status(500).send({errorMessage: 'There was an error sending the email', erorInfo: error});
        }
        res.status(500).send({successMessage: 'Email has been sent for Verification', status: 200});
    });
  } catch(e){
   
    console.log(e);
  }
    
});

// askpro send Email..

app.post('/api/sendEnquiry', (req, res, next) => {
  try{
    const {request_id,full_name,email,organization,phone} = req.body;
    const bccmail=envVars.PRO_ENQUIRY_BccEmail;
    console.log("id:"+request_id);
    app.mailer.send('askPro', {
        to: email,
        // bcc:'joabkr@gmail.com,sufinoon@gmail.com',
        //bcc:'moanish940@gmail.com,anish15.786@outlook.com',
        //bcc:bccmail,
        subject: 'Your request for PRO service',
        data: {request_id,full_name}

    }, (error) => {
      console.log(error);
        if (error) {
          return  res.status(500).send({errorMessage: 'There was an error sending the email', erorInfo: error});
        }
        app.mailer.send('adminAskPro', {
          to: bccmail,
          // bcc:'joabkr@gmail.com,sufinoon@gmail.com',
          //bcc:'moanish940@gmail.com,anish15.786@outlook.com',
          //bcc:bccmail,
          subject: 'PRO Enquiry - Request ID - '+[request_id],
          data: {request_id,full_name,organization,phone,email}
    
        }, (error) => {
          console.log(error);
            if (error) {
              return  res.status(500).send({errorMessage: 'There was an error sending the email', erorInfo: error});
            }
            return  res.status(200).send({successMessage: 'Email has been sent for Ask Pro Enquiry', status: 200});
        });
        //res.status(200).send({successMessage: 'Email has been sent for Ask Pro Enquiry', status: 200});
    });
  } catch(e){
    return res.send({errorMsg:e});
    console.log(e);
  }
    
});

app.post('/api/sendForgetOTP', (req, res) => {
  console.log(db);
  const {email} = req.body;
 User.findOne({ where: { email } }).then((existingUser) => {
  // console.log("what:"+existingUser);
  var fullName=existingUser.first_name;
  if (existingUser) {
    const otp  = Math.floor(100000 + Math.random() * 900000);
    const obj = {email, otp};
   OTPSchema.create(obj).then(() => {
     app.mailer.send('otp', {
     to: email,
     subject: 'Forget Password - One Time Password(OTP) from Spotlight ',
     otherProperty: 'Other Property',
     data: {greet: 'Hi '+fullName+',',OTP: otp}
     }, (err) => {
         if (err) {
             res.status(500).send({errorMessage: 'otpError', errorInfo: err});
             return;
         }
         res.status(200).send({successMessage: 'otpSentSuccess', status: 200});
     });
   })
  }
  else{
    return res.status(404).send({errorMessage: 'Sorry this user not exist',status: 404});
  } 
}).catch((error) => {
   res.status(500).send('Exception throwing' + error);
});
});
};





