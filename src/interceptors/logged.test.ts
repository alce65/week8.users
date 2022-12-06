import { logged } from './logged';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../interfaces/error';
import { readToken } from '../services/auth.js';
import { ExtraRequest } from '../interfaces/extra.request';

jest.mock('../services/auth.js');

const HTTP_ERROR = new HTTPError(
    403,
    'Forbidden',
    'Usuario o contraseña incorrecto'
);
describe('Given logged middleware', () => {
    const mockToken =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODhjYTBhODRiMWE4YjRiMDMzNzA0NyIsIm5hbWUiOiJtaXJleWEiLCJsYXN0X25hbWUiOiJjaGFwYXJybyIsImVtYWlsIjoibWlyZXlhQGdtYWlsLmNvbSIsImlhdCI6MTY2OTk5MzA0MH0.RNVAjxZMapi8uWYdFiTmAzN2Ho4AanlD8LO7FB9MNA8';

    let req: Partial<ExtraRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        req.payload = { payload: 'Test' };
        req.get = jest.fn();
        res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    describe('When user is authorize', () => {
        test('Then it returns the payload', () => {
            const mockPayload = {
                email: 'pepe@sample.com',
                iat: expect.any(Number),
                id: expect.any(String),
                last_name: 'perez',
                name: 'pepe',
            };
            (req.get as jest.Mock).mockReturnValueOnce(mockToken);
            (readToken as jest.Mock).mockReturnValue(mockPayload);
            logged(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();

            expect(req.payload).toStrictEqual({
                email: 'pepe@sample.com',
                iat: expect.any(Number),
                id: expect.any(String),
                last_name: 'perez',
                name: 'pepe',
            });
        });
    });

    describe('When user is NOT authorize (NOT token)', () => {
        test('Then it returns an error', () => {
            (req.get as jest.Mock).mockReturnValueOnce(false);
            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(HTTP_ERROR);
        });
    });
    describe('When user is NOT authorize (BAD token)', () => {
        test('Then it returns an error', () => {
            const mockBadToken = 'Bearer Bad Token';
            (req.get as jest.Mock).mockReturnValueOnce(mockBadToken);
            (readToken as jest.Mock).mockImplementationOnce(() => {
                throw HTTP_ERROR;
            });
            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(HTTP_ERROR);
        });
    });
});
