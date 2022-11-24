import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { Robot } from '../entities/robot';
import { RobotRepository } from './robot';

describe('Given a singleton instance of the class "RobotRepository"', () => {
    const mockData = [{ name: 'PepeBot' }, { name: 'LuluBot' }];
    const setUpCollection = async () => {
        await dbConnect();
        await Robot.deleteMany();
        await Robot.insertMany(mockData);
        const data = await Robot.find();
        return [data[0].id, data[1].id];
    };

    const repository = RobotRepository.getInstance();

    const badFormattedId = '1';
    const invalidId = '537b422da27b69c98b1916e1';
    let testIds: Array<string>;

    beforeAll(async () => {
        testIds = await setUpCollection();
        console.log(testIds);
    });
    describe('When it has been run getAll and it has called Model.find', () => {
        test('Then it returns the robots in the collection', async () => {
            const spyModel = jest.spyOn(Robot, 'find');
            const result = await repository.getAll();
            expect(spyModel).toHaveBeenCalled();
            expect(result[0].name).toEqual(mockData[0].name);
        });
    });

    describe('When it has been run get and it has called Model.findById', () => {
        const spyModel = jest.spyOn(Robot, 'findById');
        test('Then, if the ID has been valid, it should be returned the robot', async () => {
            const result = await repository.get(testIds[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mockData[0].name);
        });

        test('Then, if the ID has been bad formatted, it should be thrown an Cast error', async () => {
            expect(async () => {
                await repository.get(badFormattedId);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyModel).toHaveBeenCalled();
        });

        test('Then, if the ID has been invalid, it should be thrown a Validation error', async () => {
            expect(async () => {
                await repository.get(invalidId);
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run find and it has called Model.findOne', () => {
        const spyModel = jest.spyOn(Robot, 'findOne');
        test('Then, if the data has been valid, it should be returned the found robot ', async () => {
            const result = await repository.find(mockData[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mockData[0].name);
        });

        test('Then, if the data has been invalid, it should be throw an error', async () => {
            expect(async () => {
                await repository.find({ name: 'NoBot' });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run post and it has called Model.create', () => {
        const spyModel = jest.spyOn(Robot, 'create');
        test('Then, if the data has been valid, it should be returned the new robot', async () => {
            const newRobot = { name: 'OldBot', date: '2020-1-12Z' };
            const result = await repository.post(newRobot);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(newRobot.name);
        });
        test('Then, if the data has been valid but without date, it should be returned the new robot', async () => {
            const newRobot = { name: 'BigBot' };
            const result = await repository.post(newRobot);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(newRobot.name);
        });
        test('Then, if the data has been valid but with invalid date, it should be returned the new robot', async () => {
            const newRobot = { name: 'SimpleBot', date: 'Enero' };
            const result = await repository.post(newRobot);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(newRobot.name);
        });

        test('Then, if the data has been invalid, it should be thrown a Validation error', () => {
            const newRobot = {};
            expect(async () => {
                await repository.post(newRobot);
            }).rejects.toThrowError(mongoose.Error.ValidationError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run patch and it has called Model.findByIdAndUpdate', () => {
        const spyModel = jest.spyOn(Robot, 'findByIdAndUpdate');
        test('Then, if the ID has been valid, it should be returned the updated robot', async () => {
            const updateName = 'MyBot';
            const result = await repository.patch(testIds[0], {
                name: updateName,
            });
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(updateName);
        });

        test('Then, if the ID has been invalid, it should be thrown an error', async () => {
            const updateName = 'MyBot';
            expect(async () => {
                await repository.patch(invalidId, { name: updateName });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run delete and it has called Model.findByIdAndDelete', () => {
        const spyModel = jest.spyOn(Robot, 'findByIdAndDelete');
        test('Then, if the ID has been valid, it should be returned the deleted robot', async () => {
            const result = await repository.delete(testIds[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result).toEqual(testIds[0]);
        });

        test('Then if the ID has been bad formatted, it should be thrown a CastError error', async () => {
            expect(async () => {
                await repository.delete(badFormattedId);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyModel).toHaveBeenCalled();
        });

        test('Then if the ID has been invalid, it should be thrown an error', async () => {
            expect(async () => {
                await repository.delete(invalidId);
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
