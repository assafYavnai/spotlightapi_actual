import { DB_TYPES } from './dbTypes';
export const ENV ='development';
export const DB_TYPE = process.env.DB_TYPE || DB_TYPES.POSTGRES;
export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || null;
export const SMTP_FROM =  'munna.bhakta1001@gmail.com';
export const CONTACT_SMTP_FROM='contactus@thespotlightsystem.com';
export const SMTP_HOST ='smtp.gmail.com';
export const SMTP_PORT =465;
export const SMTP_USERNAME = 'munna.bhakta1001@gmail.com';
export const SMTP_PASSWORD = 'rrguuftkqwdoxuav';
export const PRO_ENQUIRY_BccEmail = 'surinderdhanjufss@gmail.com,surinderdhanju056@gmail.com';
export const INTERNETEXPLORER_EMAIL='surinderkumardhanju@gmail.com';
export const INTERNETEXPLORER_BccEMAIL='surinderdhanjufss@gmail.com';
export const SMTP_SECURE = true;
export const config_dir = 'F:/bit-bucket/spotlight/config';
export const postgres = {username:'postgres',server:'192.168.1.101',password:'123456',database:'spotlight'};
export const hostName ="http://localhost:3000";
export const privateLocalAddress ="http://localhost:5000";