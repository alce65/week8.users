import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { Robot } from '../entities/robot';
import { RobotRepository } from './robot';

const mockData = [{ name: 'PepeBot' }, { name: 'LuluBot' }];

describe('Given ...', () => {
    const repository = RobotRepository.getInstance();
    let testIds: Array<string>;
    beforeAll(async () => {
        await dbConnect();
        await Robot.deleteMany();
        await Robot.insertMany(mockData);
        const data = await Robot.find();
        testIds = [data[0].id, data[1].id];
        console.log(testIds);
    });

    test('Then getAll...', async () => {
        const result = await repository.getAll();
        expect(result[0].name).toEqual(mockData[0].name);
    });

    test.todo('Then get with valid ID');

    test.todo('Then get with invalid ID');

    test('Then post with valid data', async () => {
        const newRobot = {
            name: 'BubuBot',
        };
        const result = await repository.post(newRobot);
        expect(result.name).toEqual(newRobot.name);
    });

    test.todo('Then post with invalid data');

    test.todo('Then update with valid ID');

    test.todo('Then update with invalid ID');

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
