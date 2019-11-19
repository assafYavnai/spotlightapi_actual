const envoirnment = process.env.NODE_ENV || 'development';
const envVars =require(`./env.${envoirnment}.js`);

export const ENV = envVars.ENV;
export const DB_TYPE = envVars.DB_TYPE;
export const GOOGLE_ANALYTICS_ID = envVars.GOOGLE_ANALYTICS_ID;
export const SMTP_FROM = envVars.SMTP_FROM;
export const CONTACT_SMTP_FROM=envVars.CONTACT_SMTP_FROM;
export const SMTP_HOST =envVars.SMTP_HOST;
export const SMTP_PORT = envVars.SMTP_PORT;
export const SMTP_USERNAME = envVars.SMTP_USERNAME;
export const SMTP_PASSWORD = envVars.SMTP_PASSWORD;
export const PRO_ENQUIRY_BccEmail = envVars.PRO_ENQUIRY_BccEmail;
export const SMTP_SECURE = envVars.SMTP_SECURE;
export const config_dir = envVars.config_dir;
export const postgres =envVars.postgres;
export const hostName = envVars.hostName;
export const privateLocalAddress =envVars.privateLocalAddress;
