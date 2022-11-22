import mongoose from 'mongoose';
import { USER, CLUSTER, PASSWD } from './config.js';

export async function dbConnect() {
    const DBName =
        process.env.NODE_ENV !== 'test' ? 'Coders2022' : 'CodersTesting';
    let uri = `mongodb+srv://${USER}:${PASSWD}`;
    uri += `@${CLUSTER}/${DBName}?retryWrites=true&w=majority`;
    return mongoose.connect(uri);
}
