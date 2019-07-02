import { DB_TYPES } from './dbTypes';
export const ENV = process.env.NODE_ENV || 'development';

export const DB_TYPE = process.env.DB_TYPE || DB_TYPES.POSTGRES;

export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || null;

export const SMTP_FROM ='munna.bhakta1001@gmail.com';
export const SMTP_HOST='smtp.gmail.com';
export const SMTP_PORT=465;
export const SMTP_USERNAME='munna.bhakta1001@gmail.com';
export const SMTP_PASSWORD='rrguuftkqwdoxuav';

export const invitationLink="http://signal-in.com/spotlight/check/";
