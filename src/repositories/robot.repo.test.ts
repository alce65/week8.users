import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { RobotRepository } from './robot.repo';

describe('Given a singleton instance of the class "RobotRepository"', () => {
    const mockData = [{ name: 'PepeBot' }, { name: 'LuluBot' }];
    const repository = RobotRepository.getInstance();
    const Robot = repository.getModel();

    const setUpCollection = async () => {
        await dbConnect();
        await Robot.deleteMany().exec();
        await Robot.insertMany(mockData);
        const data = await Robot.find().exec();
        return [data[0].id, data[1].id];
    };

    const badFormattedId = '1';
    const invalidId = new mongoose.Types.ObjectId().toString();
    // '537b422da27b69c98b1916e1';
    let testIds: Array<string>;

    beforeAll(async () => {
        testIds = await setUpCollection();
    });
    describe('When it has been run getAll and it has called Model.find', () => {
        test('Then it returns the robots in the collection', async () => {
            const spyRobotModel = jest.spyOn(Robot, 'find');
            const result = await repository.search();
            expect(spyRobotModel).toHaveBeenCalled();
            expect(result[0].name).toEqual(mockData[0].name);
        });
    });

    describe('When it has been run get and it has called Model.findById', () => {
        const spyRobotModel = jest.spyOn(Robot, 'findById');
        test('Then, if the ID has been valid, it should be returned the robot', async () => {
            const result = await repository.queryId(testIds[0]);
            expect(spyRobotModel).toHaveBeenCalled();
            expect(result.name).toEqual(mockData[0].name);
        });

        test('Then, if the ID has been bad formatted, it should be thrown an Cast error', async () => {
            expect(async () => {
                await repository.queryId(badFormattedId);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyRobotModel).toHaveBeenCalled();
        });

        test('Then, if the ID has been invalid, it should be thrown a Validation error', async () => {
            expect(async () => {
                await repository.queryId(invalidId);
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyRobotModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run find and it has called Model.findOne', () => {
        const spyRobotModel = jest.spyOn(Robot, 'findOne');
        test('Then, if the data has been valid, it should be returned the found robot ', async () => {
            const result = await repository.query(mockData[0]);
            expect(spyRobotModel).toHaveBeenCalled();
            expect(result.name).toEqual(mockData[0].name);
        });

        test('Then, if the data has been invalid, it should be throw an error', async () => {
            expect(async () => {
                await repository.query({ name: 'NoBot' });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyRobotModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run post and it has called Model.create', () => {
        const spyRobotModel = jest.spyOn(Robot, 'create');
        test('Then, if the data has been valid, it should be returned the new robot', async () => {
            const newRobot = { name: 'OldBot', date: '2020-1-12Z' };
            const result = await repository.create(newRobot);
            expect(spyRobotModel).toHaveBeenCalled();
            expect(result.name).toEqual(newRobot.name);
        });
        test('Then, if the data has been valid but without date, it should be returned the new robot', async () => {
            const newRobot = { name: 'BigBot' };
            const result = await repository.create(newRobot);
            expect(spyRobotModel).toHaveBeenCalled();
            expect(result.name).toEqual(newRobot.name);
        });
        test('Then, if the data has been valid but with invalid date, it should be returned the new robot', async () => {
            const newRobot = { name: 'SimpleBot', date: 'Enero' };
            const result = await repository.create(newRobot);
            expect(spyRobotModel).toHaveBeenCalled();
            expect(result.name).toEqual(newRobot.name);
        });

        test('Then, if the data has been invalid, it should be thrown a Validation error', () => {
            const newRobot = {};
            expect(async () => {
                await repository.create(newRobot);
            }).rejects.toThrowError(mongoose.Error.ValidationError);
            expect(spyRobotModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run patch and it has called Model.findByIdAndUpdate', () => {
        const spyRobotModel = jest.spyOn(Robot, 'findByIdAndUpdate');
        test('Then, if the ID has been valid, it should be returned the updated robot', async () => {
            const updateRobotName = 'MyBot';
            const result = await repository.update(testIds[0], {
                name: updateRobotName,
            });
            expect(spyRobotModel).toHaveBeenCalled();
            expect(result.name).toEqual(updateRobotName);
        });

        test('Then, if the ID has been invalid, it should be thrown an error', async () => {
            const updateRobotName = 'MyBot';
            expect(async () => {
                await repository.update(invalidId, { name: updateRobotName });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyRobotModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run delete and it has called Model.findByIdAndDelete', () => {
        const spyRobotModel = jest.spyOn(Robot, 'findByIdAndDelete');
        test('Then, if the ID has been valid, it should be returned the deleted robot', async () => {
            const result = await repository.delete(testIds[0]);
            expect(spyRobotModel).toHaveBeenCalled();
            expect(result).toEqual(testIds[0]);
        });

        test('Then if the ID has been bad formatted, it should be thrown a CastError error', async () => {
            expect(async () => {
                await repository.delete(badFormattedId);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyRobotModel).toHaveBeenCalled();
        });

        test('Then if the ID has been invalid, it should be thrown an error', async () => {
            expect(async () => {
                await repository.delete(invalidId);
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyRobotModel).toHaveBeenCalled();
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
