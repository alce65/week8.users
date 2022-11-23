import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { RobotRepository } from './robot';

const mockData = [
    {
        name: 'PepeBot',
    },
    { name: 'LuluBot' },
];

describe('Given ...', () => {
    const repository = RobotRepository.getInstance();
    let testIds: Array<string>;
    beforeAll(async () => {
        await dbConnect();
        await repository.getModel().deleteMany();
        await repository.getModel().insertMany(mockData);
        const data = await repository.getModel().find();
        testIds = [data[0].id, data[1].id];
    });

    test('Then getAll...', async () => {
        const result = await repository.getAll();
        expect(result[0].name).toEqual(mockData[0].name);
    });

    test('Then post ...', async () => {
        const newRobot = {
            name: 'BubuBot',
        };
        const result = await repository.post(newRobot);
        expect(result.name).toEqual(newRobot.name);
    });

    test('Then delete ...', async () => {
        const result = await repository.delete(testIds[0]);
        expect(result).toEqual(testIds[0]);
    });

    test('Then delete ...', async () => {
        expect(async () => {
            await repository.delete(1);
        }).rejects.toThrowError(mongoose.Error.CastError);
    });

    test('Then delete ...', async () => {
        expect(async () => {
            await repository.delete('537b422da27b69c98b1916e1');
        }).rejects.toThrowError(Error);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
