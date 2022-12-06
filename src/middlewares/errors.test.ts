import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../interfaces/error';
import { errorManager } from './errors';

describe('Given errorManager middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    const mockError = {
        statusCode: 500,
        statusMessage: 'Test error message',
        name: 'Test error',
        message: 'Test error description',
    };
    describe('When we call it', () => {
        test('Then it call next function with the status code', () => {
            errorManager(
                mockError,
                req as Request,
                res as unknown as Response,
                next
            );
            expect(res.status).toBeCalledWith(mockError.statusCode);
        });
    });

    describe('When the name of the error is ValidationError', () => {
        test('Then it call the next function with a 406 status', () => {
            mockError.name = 'ValidationError';
            mockError.statusCode = 406;
            errorManager(
                mockError,
                req as Request,
                res as unknown as Response,
                next
            );
            expect(res.status).toBeCalledWith(mockError.statusCode);
        });
    });

    describe('When there is not a status code', () => {
        test('Then it should be 500', () => {
            const mockNonStatus = {
                name: 'Error',
                statusMessage: 'error',
                message: 'Error',
            };

            errorManager(
                mockNonStatus as CustomError,
                req as Request,
                res as unknown as Response,
                next
            );

            expect(res.status).toBeCalledWith(500);
        });
    });
});
