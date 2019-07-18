import { ENV } from './env';

export const isProduction = ENV === 'production';
export const isDebug = ENV === 'development';
export const isClient = typeof window !== 'undefined';

export const hostName = isDebug ? 'http://localhost:3000' : 'http://122.160.166.186:5000';
export const privateLocalAddress = isDebug ? 'http://localhost:5000' : 'http://192.168.1.101:5000';


