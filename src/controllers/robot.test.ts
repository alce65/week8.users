import { NextFunction, Request, Response } from 'express';
import { RobotRepository } from '../repositories/robot';
import { UserRepository } from '../repositories/user';
import { RobotController } from './robot';

jest.mock('../repositories/robot');

describe('Given RobotController', () => {
    RobotRepository.prototype.getAll = jest.fn().mockResolvedValue(['bot']);
    const repository = new RobotRepository();
    const userRepo = new UserRepository();

    const robotController = new RobotController(repository, userRepo);
    const req: Partial<Request> = {};
    const resp: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();
    test('Then ... getAll', async () => {
        await robotController.getAll(req as Request, resp as Response, next);
        expect(resp.json).toHaveBeenCalledWith({ robots: ['bot'] });
    });
});
