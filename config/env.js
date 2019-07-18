import { DB_TYPES } from './dbTypes';
export const ENV = process.env.NODE_ENV || 'development';
export const DB_TYPE = process.env.DB_TYPE || DB_TYPES.POSTGRES;
const isProduction = ENV === 'production';
export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || null;

export const SMTP_FROM = isProduction ? 'noreply@thespotlightsystem.com' : 'munna.bhakta1001@gmail.com';
export const CONTACT_SMTP_FROM=isProduction ? 'contactus@thespotlightsystem.com' : 'contactus@thespotlightsystem.com';
export const SMTP_HOST = isProduction ? 'smtp.gmail.com' : 'smtp.gmail.com';
export const SMTP_PORT = isProduction ? 465 : 465;
export const SMTP_USERNAME = isProduction ? 'noreply@thespotlightsystem.com' : 'munna.bhakta1001@gmail.com';
export const SMTP_PASSWORD = isProduction ? 'gunr1014' : 'rrguuftkqwdoxuav';
export const PRO_ENQUIRY_BccEmail = isProduction ? 'joabkr@gmail.com,sufinoon@gmail.com' : 'surinderdhanjufss@gmail.com,surinderdhanju056@gmail.com';
export const config_dir = isProduction ? '/usr/src/spotlight/config' : 'F:/bit-bucket/spotlight/config';