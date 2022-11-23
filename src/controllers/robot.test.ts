import { NextFunction, Request, Response } from 'express';
import { RobotRepository } from '../repositories/robot';
import { UserRepository } from '../repositories/user';
import { RobotController } from './robot';

jest.mock('../repositories/robot');

describe('Given RobotController', () => {
    const mockResponse = { robots: ['bot'] };
    RobotRepository.prototype.getAll = jest
        .fn()
        .mockResolvedValue(mockResponse);
    const repository = RobotRepository.getInstance();
    const userRepo = UserRepository.getInstance();

    const robotController = new RobotController(repository, userRepo);
    const req: Partial<Request> = {};
    const resp: Partial<Response> = {
        json: jest.fn(),
    };
    const next: NextFunction = jest.fn();
    test('Then ... getAll', async () => {
        await robotController.getAll(req as Request, resp as Response, next);
        expect(resp.json).toHaveBeenCalledWith(mockResponse);
    });
});
