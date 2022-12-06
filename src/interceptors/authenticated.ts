import createDebug from 'debug';
import { Response, NextFunction } from 'express';
import { RobotRepository } from '../repositories/robot.repo.js';
import { HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../interfaces/extra.request.js';
const debug = createDebug('W8:interceptors:authorized');

const HTTP_ERROR = new HTTPError(
    403,
    'Forbidden',
    'Usuario o contraseña incorrecto'
);

// Authentication: ¿Soy quien digo ser? ¿User?
// Ejemplo como clase
export class Authenticated {
    httpError: HTTPError;
    constructor(public repo: RobotRepository) {
        this.httpError = HTTP_ERROR;
    }

    async who(req: ExtraRequest, res: Response, next: NextFunction) {
        debug('who');
        try {
            const robot = await this.repo.queryId(req.params.id);
            if (!req.payload || robot.owner.id !== req.payload.id) {
                next(this.httpError);
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

// Ejemplo del mismo código como función
export const who = async (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    debug('who');
    const repo = RobotRepository.getInstance();
    try {
        const robot = await repo.queryId(req.params.id);
        if (!req.payload || robot.owner.id !== req.payload.id) {
            next(HTTP_ERROR);
        }
        next();
    } catch (error) {
        next(error);
    }
};
