import { DB_TYPES } from './dbTypes';
export const ENV = process.env.NODE_ENV || 'development';
export const DB_TYPE = process.env.DB_TYPE || DB_TYPES.POSTGRES;

export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || null;

export const SMTP_FROM ='noreply@thespotlightsystem.com';
export const CONTACT_SMTP_FROM='contactus@thespotlightsystem.com';
export const SMTP_HOST='smtp.gmail.com';
export const SMTP_PORT=465;
export const SMTP_USERNAME='noreply@thespotlightsystem.com';
export const SMTP_PASSWORD='gunr1014';
export const PRO_ENQUIRY_BccEmail='joabkr@gmail.com,sufinoon@gmail.com';
//export const PRO_ENQUIRY_BccEmail='surinderdhanjufss@gmail.com,surinderdhanju056@gmail.com';
export const invitationLink="http://signal-in.com/spotlight/check/";
export const config_dir = 'F:/bit-bucket/spotlight/config';