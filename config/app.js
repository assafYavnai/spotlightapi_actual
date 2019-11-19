import { ENV,hostName as host,privateLocalAddress as localHost } from './env';

export const isProduction = ENV == 'production';
export const isDebug = ENV == 'development';
export const isClient = typeof window !== 'undefined';
export const hostName = host;
export const privateLocalAddress = localHost;


