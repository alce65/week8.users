import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db.connect';
import { User } from '../entities/user';
import { RobotRepository } from '../repositories/robot';
import { UserRepository } from '../repositories/user';
import { passwdEncrypt } from '../services/auth';

const setCollection = async (name: string, passwd: string) => {
    const usersMock: Array<Partial<User>> = [
        {
            name,
            email: 'ramon@acme.com',
            passwd: await passwdEncrypt(passwd),
            role: 'user',
        },
    ];
    const User = UserRepository.getInstance().getModel();
    // const Robot = RobotRepository.getInstance().getModel();
    await User.deleteMany();
    await User.insertMany(usersMock);
    // await Robot.deleteMany();
    // const data = await User.find();
    // const testIds = [data[0].id, data[1].id];
    // return testIds;
};

describe(`Given an "app" with "/users" route 
    and a valid connection to mongoDB'`, () => {
    const name = 'Ramon';
    const passwd = '54321';
    const mockNewUser: Partial<User> = {
        name: 'Pepe',
        email: 'pepe@sample.com',
        passwd: '12345',
        role: 'admin',
    };
    describe('When I make a post to url /users/register', () => {
        beforeEach(async () => {
            await dbConnect();
            await setCollection(name, passwd);
        });

        afterEach(async () => {
            await mongoose.disconnect();
        });

        test('Then if the data are valid, the api should sent status 201', async () => {
            const response = await request(app)
                .post('/users/register')
                .send(mockNewUser);
            expect(response.status).toBe(201);
        });
        test('Then if the data do not have valid name, the api should sent status 503', async () => {
            mockNewUser.name = '';
            const response = await request(app)
                .post('/users/register')
                .send(mockNewUser);
            expect(response.status).toBe(503);
        });
        test('Then if the data do not have valid passwd, the api should sent status 503', async () => {
            mockNewUser.passwd = '';
            const response = await request(app)
                .post('/users/register')
                .send(mockNewUser);
            expect(response.status).toBe(503);
        });
    });
    describe('When I make a post to url /users/login', () => {
        beforeEach(async () => {
            await dbConnect();
            await setCollection(name, passwd);
        });

        afterEach(async () => {
            await mongoose.disconnect();
        });
        test('Then if the data are valid, the api should sent status 200', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({ name, passwd });
            expect(response.status).toBe(200);
        });
        test('Then if there are not user, the api should sent status 404', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({ passwd });
            expect(response.status).toBe(404);
        });
        test('Then if there are not passwd, the api should sent status 503', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({ name });
            expect(response.status).toBe(503);
        });
        test('Then if the passwd are not valid, the api should sent status 503', async () => {
            const response = await request(app)
                .post('/users/login')
                .send({ name, passwd: '00000' });
            expect(response.status).toBe(503);
        });
    });
});
