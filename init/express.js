import express from 'express';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import flash from 'express-flash';
import methodOverride from 'method-override';
import gzip from 'compression';
import helmet from 'helmet';
import unsupportedMessage from '../db/unsupportedMessage';
import { sessionSecret, sessionId } from '../config/secrets';
import { DB_TYPE, ENV, OnlineUsers, OnlineSockets } from '../config/env';
import { session as dbSession } from '../db';

export default (app) => {
  app.set('port', (process.env.PORT || 5000));
  var expressWs = require('express-ws')(app);
  if (ENV === 'production') {
    app.use(gzip());
    // Secure your Express apps by setting various HTTP headers. Documentation: https://github.com/helmetjs/helmet
    app.use(helmet());
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(methodOverride());
  app.use(cookieParser());

  app.use(express.static(path.join(process.cwd(), 'public')));
  
  var aWss = expressWs.getWss('/');
app.ws('/', function(ws,req) {
  let  uid = req.query.email;
  uid=uid.replace(" ","+");
  if( uid!=undefined && OnlineUsers.indexOf(uid)>0){
    OnlineSockets[OnlineUsers.indexOf(uid)]=ws;
  }
  if(uid != undefined && OnlineUsers.indexOf(uid)<0){
    OnlineUsers.push(uid);
    OnlineSockets.push(ws); 
    aWss.clients.forEach(function (client) {
      client.send('refreshUser');
  });
}
  
ws.onclose=function(msg,req){

  console.log(OnlineSockets.indexOf(msg.target));
  console.log('disconnect');
  console.log(msg.target);
  let uindex = OnlineSockets.indexOf(msg.target);
  if(uindex>-1){
    OnlineUsers.splice(uindex,1);
    OnlineSockets.splice(uindex,1);
    aWss.clients.forEach(function (client) {
      client.send('refreshUser');
  });
  }
  try {
    msg.target.terminate();  
  } catch(e) {
    console.log("Error While termiate in onClose");
  }
  
};
ws.onmessage = function(msg) {
    console.log(msg.data);
    if(msg.data.indexOf('disconnect')>-1){
      const uid = msg.data.split('-')[1];
      if(uid != undefined && OnlineUsers.indexOf(uid)>-1){
       const index =OnlineUsers.indexOf(uid);
       OnlineUsers.splice(index,1)
       
       try {
        aWss.clients.forEach(function (client) {
          //console.log(client);
          client.send('refreshUser');
        });
        OnlineSockets[index].terminate();
       } catch(e){
        console.log("Error While termiate in onMessage -Array");
       }
       
      }
      try {
        msg.target.terminate();
      } catch(e) {
        console.log("Error While termiate in onMessage");
      }
      
    } else {
      aWss.clients.forEach(function (client) {
        //console.log(client);
        client.send(msg.data);
      });
    }
    
    
    
};
});
app.get('/api/dashboardUpdate',function(req,res,next){
aWss.clients.forEach(function (client) {
    client.send('refreshData');
});
return res.status(200).send("Notiifcaiton Sent");
});

app.get('/api/user/refreshUser',function(req,res,next){
  return res.status(200).send({data:OnlineUsers});
  });


  app.use('/apidoc', express.static(path.join(process.cwd(), 'apidoc')));

  process.on('uncaughtException', function (err) {
    console.log('Critital Error');
    console.log((new Date).toUTCString() + ' Uncaught Exception:', err.message);
    console.log(err.stack)
    //process.exit(1);
  });
  // I am adding this here so that the Heroku deploy will work
  // Indicates the app is behind a front-facing proxy,
  // and to use the X-Forwarded-* headers to determine the connection and the IP address of the client.
  // NOTE: X-Forwarded-* headers are easily spoofed and the detected IP addresses are unreliable.
  // trust proxy is disabled by default.
  // When enabled, Express attempts to determine the IP address of the client connected through the front-facing proxy, or series of proxies.
  // The req.ips property, then, contains an array of IP addresses the client is connected through.
  // To enable it, use the values described in the trust proxy options table.
  // The trust proxy setting is implemented using the proxy-addr package. For more information, see its documentation.
  // loopback - 127.0.0.1/8, ::1/128
  app.set('trust proxy', 'loopback');
  // Create a session middleware with the given options
  // Note session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.
  // Options: resave: forces the session to be saved back to the session store, even if the session was never
  //                  modified during the request. Depending on your store this may be necessary, but it can also
  //                  create race conditions where a client has two parallel requests to your server and changes made
  //                  to the session in one request may get overwritten when the other request ends, even if it made no
  //                  changes(this behavior also depends on what store you're using).
  //          saveUnitialized: Forces a session that is uninitialized to be saved to the store. A session is uninitialized when
  //                  it is new but not modified. Choosing false is useful for implementing login sessions, reducing server storage
  //                  usage, or complying with laws that require permission before setting a cookie. Choosing false will also help with
  //                  race conditions where a client makes multiple parallel requests without a session
  //          secret: This is the secret used to sign the session ID cookie.
  //          name: The name of the session ID cookie to set in the response (and read from in the request).
  //          cookie: Please note that secure: true is a recommended option.
  //                  However, it requires an https-enabled website, i.e., HTTPS is necessary for secure cookies.
  //                  If secure is set, and you access your site over HTTP, the cookie will not be set.
  let sessionStore = null;
  if (!dbSession) {
    console.warn(unsupportedMessage('session'));
  } else {
    sessionStore = dbSession();
  }

  const sess = {
    resave: false,
    saveUninitialized: false,
    secret: sessionSecret,
    proxy: true, // The "X-Forwarded-Proto" header will be used.
    name: sessionId,
    // Add HTTPOnly, Secure attributes on Session Cookie
    // If secure is set, and you access your site over HTTP, the cookie will not be set
    cookie: {
      httpOnly: true,
      secure: false,
    },
    store: sessionStore
  };

  console.log('--------------------------');
  console.log('===> 😊  Starting Server . . .');
  console.log(`===>  Environment: ${ENV}`);
  console.log(`===>  Listening on port: ${app.get('port')}`);
  console.log(`===>  Using DB TYPE: ${DB_TYPE}`);
  if (ENV === 'production') {
    console.log('===> 🚦  Note: In order for authentication to work in production');
    console.log('===>           you will need a secure HTTPS connection');
    sess.cookie.secure = true; // Serve secure cookies
  }
  console.log('--------------------------');
require('./email')(app);
  app.use(session(sess));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());
};
