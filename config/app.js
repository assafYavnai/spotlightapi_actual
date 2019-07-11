import { ENV } from './env';

export const isProduction = ENV === 'production';
export const isDebug = ENV === 'development';
export const isClient = typeof window !== 'undefined';

export const apiEndpoint = isDebug ? 'http://localhost:3000/api' : 'http://122.160.166.186:5000/api';
export const hostName = isDebug ? 'http://localhost:3000' : 'http://122.160.166.186:5000';
export const privateLocalAddress = isDebug ? 'http://localhost:5000' : 'http://192.168.1.101:5000';
export const googleClientID = isDebug ? '89174916760-h7hsmtj8pcpgmjjpedmb3cm1r16nt4v9.apps.googleusercontent.com' : '89174916760-ep5sanj7095ukhe638pcir2g2m2np8dq.apps.googleusercontent.com';
// Replace with 'UA-########-#' or similar to enable tracking
export const trackingID = null;

