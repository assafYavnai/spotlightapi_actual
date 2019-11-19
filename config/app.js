import { ENV,hostName,privateLocalAddress } from './env';

export const isProduction = ENV == 'production';
export const isDebug = ENV == 'development';
export const isClient = typeof window !== 'undefined';
export const hostName = hostName;
export const privateLocalAddress = privateLocalAddress;


