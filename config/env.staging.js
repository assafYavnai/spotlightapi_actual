import { DB_TYPES } from './dbTypes';
export const ENV = 'staging';
export const DB_TYPE = process.env.DB_TYPE || DB_TYPES.POSTGRES;
export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || null;
export const SMTP_FROM = 'munna.bhakta1001@gmail.com';
export const CONTACT_SMTP_FROM='munna@ferventsoft.com';
export const SMTP_HOST = 'smtp.ferventsoft.com';
export const SMTP_PORT = 587;
export const SMTP_USERNAME = 'sl@ferventsoft.com';
export const SMTP_PASSWORD = 'Spotlight@123';
export const PRO_ENQUIRY_BccEmail = 'surinderdhanjufss@gmail.com,surinderdhanju056@gmail.com';
export const SMTP_SECURE = true;
export const config_dir = 'C:/Munna/projects/spotlight/config';
export const postgres = {username:'postgres',server:'192.168.1.101',password:'123456',database:'spotlight'};
