export const NODE_ENV = process.env.NODE_ENV;
export const IS_PROD = !!+process.env.PROD;
export const IS_DEV = !+process.env.PROD;
export const API_DOMAIN = process.env.PROTOCOL + process.env.API_DOMAIN;