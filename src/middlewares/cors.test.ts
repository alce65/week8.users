import { Request, Response, NextFunction } from 'express';
import { setCors } from './cors';

describe('Given cors middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { header: jest.fn() };
        res = {};
        res.setHeader = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    describe('When origin is "*"', () => {
        test('Then it set * header', () => {
            (req.header as jest.Mock).mockReturnValue('');
            setCors(req as Request, res as Response, next);
            expect(res.setHeader).toHaveBeenCalled();
        });
    });

    describe('When origin is "Origin"', () => {
        test('Then it set * header', () => {
            (req.header as jest.Mock).mockReturnValue('Origin value in header');
            setCors(req as Request, res as Response, next);
            expect(res.setHeader).toHaveBeenCalledWith(
                'Access-Control-Allow-Origin',
                'Origin value in header'
            );
        });
    });
});
