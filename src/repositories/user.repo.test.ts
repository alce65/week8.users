import mongoose from 'mongoose';
import { dbConnect } from '../db.connect';
import { UserRepository } from './user.repo';
import { passwdEncrypt } from '../services/auth.js';

jest.mock('../services/auth.js');

describe('Given a singleton instance of the class "UserRepository"', () => {
    const mockData = [{ name: 'Pepe' }, { name: 'Luisa' }];
    const repository = UserRepository.getInstance();
    const User = repository.getModel();

    const setUpCollection = async () => {
        await dbConnect();
        await User.deleteMany().exec();
        await User.insertMany(mockData);
        const data = await User.find().exec();
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
        test('Then it returns the users in the collection', async () => {
            const spyUserModel = jest.spyOn(User, 'find');
            const result = await repository.search();
            expect(spyUserModel).toHaveBeenCalled();
            expect(result[0].name).toEqual(mockData[0].name);
        });
    });

    describe('When it has been run get and it has called Model.findById', () => {
        const spyUserModel = jest.spyOn(User, 'findById');
        test('Then, if the ID has been valid, it should be returned the user', async () => {
            const result = await repository.queryId(testIds[0]);
            expect(spyUserModel).toHaveBeenCalled();
            expect(result.name).toEqual(mockData[0].name);
        });

        test('Then, if the ID has been bad formatted, it should be thrown an Cast error', async () => {
            expect(async () => {
                await repository.queryId(badFormattedId);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyUserModel).toHaveBeenCalled();
        });

        test('Then, if the ID has been invalid, it should be thrown a Validation error', async () => {
            expect(async () => {
                await repository.queryId(invalidId);
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyUserModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run find and it has called Model.findOne', () => {
        const spyUserModel = jest.spyOn(User, 'findOne');
        test('Then, if the data has been valid, it should be returned the found user ', async () => {
            const result = await repository.query(mockData[0]);
            expect(spyUserModel).toHaveBeenCalled();
            expect(result.name).toEqual(mockData[0].name);
        });

        test('Then, if the data has been invalid, it should be throw an error', async () => {
            expect(async () => {
                await repository.query({ name: 'NoUser' });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyUserModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run post and it has called Model.create', () => {
        const spyUserModel = jest.spyOn(User, 'create');
        test('Then, if the data has been valid, it should be returned the new user', async () => {
            const mockEncryptPwd = '12345';
            const newUser = { name: 'NewUser', passwd: mockEncryptPwd };
            (passwdEncrypt as jest.Mock).mockResolvedValue(mockEncryptPwd);
            const result = await repository.create(newUser);
            expect(spyUserModel).toHaveBeenCalled();
            expect(passwdEncrypt).toHaveBeenCalled();
            expect(result.name).toEqual(newUser.name);
        });

        test('Then, if the data has NOT passwd, it should be thrown a error', () => {
            const newUser = { name: 'NewUser' };
            expect(async () => {
                await repository.create(newUser);
            }).rejects.toThrow();
        });

        test('Then, if the data has NOT name, it should be thrown a Validation error', () => {
            const mockEncryptPwd = '12345';
            const newUser = { passwd: mockEncryptPwd };
            (passwdEncrypt as jest.Mock).mockResolvedValue('12345');
            expect(async () => {
                await repository.create(newUser);
            }).rejects.toThrowError(mongoose.Error.ValidationError);
        });
    });

    describe('When it has been run patch and it has called Model.findByIdAndUpdate', () => {
        const spyUserModel = jest.spyOn(User, 'findByIdAndUpdate');
        test('Then, if the ID has been valid, it should be returned the updated user', async () => {
            const updateUserName = 'Ernesto';
            const result = await repository.update(testIds[0], {
                name: updateUserName,
            });
            expect(spyUserModel).toHaveBeenCalled();
            expect(result.name).toEqual(updateUserName);
        });

        test('Then, if the ID has been invalid, it should be thrown an error', async () => {
            const updateUserName = 'Ernesto';
            expect(async () => {
                await repository.update(invalidId, { name: updateUserName });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyUserModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run delete and it has called Model.findByIdAndDelete', () => {
        const spyUserModel = jest.spyOn(User, 'findByIdAndDelete');
        test('Then, if the ID has been valid, it should be returned the deleted user', async () => {
            const result = await repository.delete(testIds[0]);
            expect(spyUserModel).toHaveBeenCalled();
            expect(result).toEqual(testIds[0]);
        });

        test('Then if the ID has been bad formatted, it should be thrown a CastError error', async () => {
            expect(async () => {
                await repository.delete(badFormattedId);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyUserModel).toHaveBeenCalled();
        });

        test('Then if the ID has been invalid, it should be thrown an error', async () => {
            expect(async () => {
                await repository.delete(invalidId);
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyUserModel).toHaveBeenCalled();
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
