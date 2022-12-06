// post('robots/', ;
// patch('robots/:id',
// delete('robots/:id',

import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db.connect';
import { createToken, TokenPayload } from '../services/auth';
import { RobotRepository } from '../repositories/robot.repo';
import { UserRepository } from '../repositories/user.repo';
import { User } from '../entities/user';

const setCollection = async () => {
    const usersMock: Array<Partial<User>> = [
        { name: 'Pepe', email: 'pepe@acme.com', role: 'user' },
        { name: 'Ramon', email: 'ramon@acme.com', role: 'user' },
    ];
    const User = UserRepository.getInstance().getModel();
    const Robot = RobotRepository.getInstance().getModel();
    await User.deleteMany();
    await User.insertMany(usersMock);
    await Robot.deleteMany();
    const data = await User.find();
    const testIds = [data[0].id, data[1].id];
    return testIds;
};

describe(`Given an "app" with "/robots" route 
    and a valid connection to mongoDB`, () => {
    let token: string;
    let ids: Array<string>;

    beforeEach(async () => {
        await dbConnect();
        ids = await setCollection();
        const payload: TokenPayload = {
            id: ids[0],
            name: 'Pepe',
            role: 'Admin',
        };
        token = createToken(payload);
    });

    afterEach(async () => {
        await mongoose.disconnect();
    });

    describe('When I make a get to url', () => {
        test('Then the get to url /robots should sent status 200', async () => {
            const response = await request(app).get('/robots/');
            expect(response.status).toBe(200);
        });

        test('Then the get to url /robots should sent status 200 (Other way)', async () => {
            await request(app).get('/robots/').expect(200);
        });

        test('Then the get to url /robots/:id with bad formed id should sent status 403', async () => {
            const response = await request(app).get('/robots/23');
            expect(response.status).toBe(503);
        });

        test('Then the get to url /robots/:id with invalid id should sent status 404', async () => {
            const response = await request(app).get(
                '/robots/637d232badb33f47c88058b5'
            );
            expect(response.status).toBe(404);
        });
    });

    describe('When I make a post to url /robots', () => {
        test('Then the post without authorization should sent status 403', async () => {
            const response = await request(app)
                .post('/robots/')
                .send({ name: 'PepeBot' });
            expect(response.status).toBe(403);
        });
        test('Then the post with authorization should sent status 201', async () => {
            const response = await request(app)
                .post('/robots/')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'PepeBot' });
            expect(response.status).toBe(201);
        });
    });
    describe('When I make a patch to url ', () => {
        //
    });
    describe('When I make a delete to url ', () => {
        //
    });
});
