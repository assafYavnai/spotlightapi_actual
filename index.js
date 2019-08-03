import express from 'express';
import expressWinston from 'express-winston';
var winston = require('winston');
require('winston-loggly-bulk');
import errorHandler from  'express-error-handler';
import { isDebug } from './config/app';
import { connect } from './db';
import cors  from 'cors';
import initPassport from './init/passport';
import initExpress from './init/express';
import initRoutes from './init/routes';
import initFileOperation from './init/fileOperation';

var enableWs =require('express-ws');
const app = express();
enableWs(app);

//expressWs(app);
app.use(errorHandler({ dumpExceptions: true, showStack: true })); 

/*
 * Database-specific setup
 * - connect to MongoDB using mongoose
 * - register mongoose Schema
 */
connect();
//app.options('*', cors()); // include before other routes
app.use(cors());
/*
 * REMOVE if you do not need passport configuration
 */
initPassport();



/*
 * Bootstrap application settings
 */
initExpress(app);

app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        'timestamp':true}),
      new winston.transports.File({
        filename: 'logs/combined.log',
        level: 'info',
        'timestamp':true
      }),
      new winston.transports.File({
        filename: 'logs/errors.log',
        level: 'error',
        'timestamp':true
      })
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    dumpExceptions:true,
    showStack: true,
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
        if(req.url=='/api'){
            return true;
        } 
        return false;
     } // optional: allows to skip some log messages based on request and/or response
  }));   
/*
 * REMOVE if you do not need any routes
 *
 * Note: Some of these routes have passport and database model dependencies
 */
initRoutes(app);
// Place the express-winston errorLogger after the router.
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.File({
            filename: 'logs/errors-unhandled.log',
            level: 'error'
          })
    ]
  }));


//   var logger = new winston.Logger({
//     transports: [
//         new winston.transports.Loggly({
//             subdomain: 'SUBDOMAIN',
//             inputToken: 'TOKEN',
//             json: true,
//             tags: ["Winston-Morgan"]
//         }),
//         new winston.transports.Console({
//             level: 'debug',
//             handleExceptions: true,
//             json: false,
//             colorize: true
//         })
//     ],
//     exitOnError: false
// }),

//     loggerstream = {
//         write: function (message, encoding) {
//             logger.info(message);
//         }
//     };

// app.use(require("morgan")("combined", { "stream": loggerstream }));  
/*
* This is where the files magic happens. We take files 
* from server and perform action as per defined in rule
*/
initFileOperation(app);
/*
 * This is where the magic happens. We take the locals data we have already
 * fetched and seed our stores with data.
 * renderMiddleware matches the URL with react-router and renders the app into
 * HTML
 */
//app.get('*', renderMiddleware);


app.listen(app.get('port'));


