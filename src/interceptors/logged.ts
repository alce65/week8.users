import createDebug from 'debug';
import { Response, NextFunction } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../interfaces/extra.request.js';
import { readToken } from '../services/auth.js';
const debug = createDebug('W8:interceptors:logged');

const HTTP_ERROR = new HTTPError(
    403,
    'Forbidden',
    'Usuario o contraseña incorrecto'
);

// Auth
// Authorization: ¿Estoy autorizado? ¿Login?
// Authentication: ¿Soy quien digo ser? ¿User?

// Authorization: ¿Estoy autorizado? ¿Login?
export const logged = (
    req: ExtraRequest,
    _res: Response,
    next: NextFunction
) => {
    debug('logged');
    const authString = req.get('Authorization');
    if (!authString || !authString?.startsWith('Bearer')) {
        next(HTTP_ERROR);
        return;
    }
    try {
        const token = authString.slice(7);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(HTTP_ERROR);
    }
};
