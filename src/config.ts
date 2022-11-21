import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

export const USER = process.env.USER;
export const PASSWD = process.env.PASSWD;
export const CLUSTER = process.env.CLUSTER;
export const SECRET = process.env.SECRET;
