import express from 'express';
import { isDebug } from './config/app';
import { connect } from './db';
import initPassport from './init/passport';
import initExpress from './init/express';
import initRoutes from './init/routes';
import errorHandler from  'express-error-handler';
const app = express();

app.use(errorHandler({ dumpExceptions: true, showStack: true })); 

/*
 * Database-specific setup
 * - connect to MongoDB using mongoose
 * - register mongoose Schema
 */
connect();

/*
 * REMOVE if you do not need passport configuration
 */
initPassport();



/*
 * Bootstrap application settings
 */
initExpress(app);

/*
 * REMOVE if you do not need any routes
 *
 * Note: Some of these routes have passport and database model dependencies
 */
initRoutes(app);

/*
 * This is where the magic happens. We take the locals data we have already
 * fetched and seed our stores with data.
 * renderMiddleware matches the URL with react-router and renders the app into
 * HTML
 */
//app.get('*', renderMiddleware);

app.listen(app.get('port'));
