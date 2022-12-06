import { Response, NextFunction } from 'express';
import { HTTPError } from '../interfaces/error';
import { ExtraRequest } from '../interfaces/extra.request';
import { RobotRepository } from '../repositories/robot.repo';
import { Authenticated, who } from './authenticated';

describe('Given authenticated middleware', () => {
    let req: Partial<ExtraRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    const httpError = new HTTPError(
        403,
        'Forbidden',
        'Usuario o contraseña incorrecto'
    );

    beforeEach(() => {
        req = {};
        req.payload = {};
        req.params = {};
        req.get = jest.fn();
        res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    describe('When the user is authenticated', () => {
        beforeEach(() => {
            req.payload = { user: 'Test user' };
            req.params = { id: '1' };
        });
        test('Then it should be run next', async () => {
            RobotRepository.prototype.queryId = jest
                .fn()
                .mockResolvedValueOnce({ name: 'Bot' });
            await who(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe(`When there are NOT logged user (NOT payload.id),`, () => {
        beforeEach(() => {
            req.payload = undefined;
        });
        test('Then it should be run next with one error', async () => {
            RobotRepository.prototype.queryId = jest.fn();
            await who(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalledWith(httpError);
        });
    });

    describe(`When there are NOT authenticated user`, () => {
        beforeEach(() => {
            req.params = { id: '' };
        });
        test('Then it should be run next with one error', async () => {
            (RobotRepository.prototype.queryId as jest.Mock).mockRejectedValue(
                new Error('Not authenticated')
            );
            await who(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalledWith(new Error('Not authenticated'));
        });
    });
});

describe('Given Authenticated class (middleware)', () => {
    const httpError = new HTTPError(
        403,
        'Forbidden',
        'Usuario o contraseña incorrecto'
    );
    describe('When we instantiate it and use who method', () => {
        let req: Partial<ExtraRequest>;
        let res: Partial<Response>;
        let next: NextFunction;
        let repo: RobotRepository;
        let authenticated: Authenticated;
        beforeEach(() => {
            req = {};
            req.payload = { payload: 'Test' };
            req.params = {};
            req.get = jest.fn();
            res = {};
            res.status = jest.fn().mockReturnValue(res);
            res.json = jest.fn().mockReturnValue(res);
            next = jest.fn();
            repo = RobotRepository.getInstance();
            repo.queryId = jest.fn().mockResolvedValue({});
            authenticated = new Authenticated(repo);
        });

        test(`Then if the user is authenticated,
                it should it should be run next`, async () => {
            req.payload = { user: 'Test user' };
            req.params = { id: '1' };
            await authenticated.who(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });

        test(`Then, if there are  NOT logged user (NOT payload.id),
                it should be run next with one error`, async () => {
            req.payload = undefined;
            await authenticated.who(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalledWith(httpError);
        });

        test(`Then, if there are NOT authenticated user
                it should be run next with one error`, async () => {
            repo.queryId = jest
                .fn()
                .mockRejectedValue(new Error('Not authenticated'));
            await who(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalledWith(new Error('Not authenticated'));
        });
    });
});
