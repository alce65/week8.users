import { dbConnect } from './db.conect';
import mongoose from 'mongoose';

test('should first', async () => {
    const result = await dbConnect();
    expect(typeof result).toBe(typeof mongoose);
    mongoose.disconnect();
});
