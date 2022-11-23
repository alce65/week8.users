import createDebug from 'debug';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HTTPError } from '../interfaces/error.js';
import { RobotRepository } from '../repositories/robot.js';
import { readToken } from '../services/auth.js';
const debug = createDebug('W8:middlewares:interceptors');

// Auth
// Authorization: ¿Estoy autorizado? ¿Login?
// Authentication: ¿Soy quien digo ser? ¿User?

export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}

// Authorization: ¿Estoy autorizado? ¿Login?
export const logged = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    debug('logged');
    const authString = req.get('Authorization');
    if (!authString || !authString?.startsWith('Bearer')) {
        next(
            new HTTPError(
                403,
                'Forbidden',
                'Usuario o contraseña incorrecto (Slice)'
            )
        );
        return;
    }
    try {
        const token = authString.slice(7);
        readToken(token);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(
            new HTTPError(403, 'Forbidden', 'Usuario o contraseña incorrecto')
        );
    }
};

// Authentication: ¿Soy quien digo ser? ¿User?
export const who = async (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    debug('who');
    const repo = RobotRepository.getInstance();
    try {
        const robot = await repo.get(req.params.id);
        if (req.payload && robot.owner._id.toString() !== req.payload.id) {
            next(
                new HTTPError(
                    403,
                    'Forbidden',
                    'Usuario o contraseña incorrecto'
                )
            );
        }
        next();
    } catch (error) {
        next(error);
    }
};
