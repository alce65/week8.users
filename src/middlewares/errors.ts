import createDebug from 'debug';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../interfaces/error';
const debug = createDebug('W8:middlewares:interceptors');
export const errorManager = (
    error: CustomError,
    _req: Request,
    resp: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
) => {
    debug(error.name, error.statusCode, error.statusMessage, error.message);
    let status = error.statusCode || 500;
    if (error.name === 'ValidationError') {
        status = 406;
    }
    const result = {
        status: status,
        type: error.name,
        error: error.message,
    };
    resp.status(status).json(result);
};
