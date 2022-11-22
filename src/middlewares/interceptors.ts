import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HTTPError } from '../interfaces/error.js';
import { readToken } from '../services/auth.js';

interface ExtraRequest extends Request {
    payload: JwtPayload;
}

export const logged = (req: Request, res: Response, next: NextFunction) => {
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
        // req.payload = readToken(token);
        next();
    } catch (error) {
        next(
            new HTTPError(403, 'Forbidden', 'Usuario o contraseña incorrecto')
        );
    }
};
