import { dbConnect } from './db.connect';
import mongoose from 'mongoose';

const spiConnect = jest.spyOn(mongoose, 'connect');

describe('Given "dbConnect"', () => {
    describe('When the environment is "test"', () => {
        test('Then it should connect with DB', async () => {
            const result = await dbConnect();
            expect(spiConnect).toHaveBeenCalled();
            expect(typeof result).toBe(typeof mongoose);
            expect(result.connection.db.databaseName).toBe('CodersTesting');
        });
    });
    describe('When the environment is not "test"', () => {
        test('Then it should connect with DB', async () => {
            process.env.NODE_ENV = 'development';
            const result = await dbConnect();
            expect(spiConnect).toHaveBeenCalled();
            expect(typeof result).toBe(typeof mongoose);
            expect(result.connection.db.databaseName).toBe('Coders2022');
        });
    });
    afterEach(() => {
        mongoose.disconnect();
    });
});
