import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Robot } from '../entities/robot.js';
import { User } from '../entities/user.js';
import { HTTPError } from '../interfaces/error.js';
import { Repo } from '../repositories/repo.js';
import { createToken, passwdValidate } from '../services/auth.js';
const debug = createDebug('W8:controllers:user');

export class UserController {
    constructor(
        public readonly repository: Repo<User>,
        public readonly robotRepo: Repo<Robot>
    ) {
        debug('instance');
    }

    async register(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('register');
            const user = await this.repository.create(req.body);
            resp.status(201).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async login(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('login', req.body.name);
            const user = await this.repository.query({ name: req.body.name });
            const isPasswdValid = await passwdValidate(
                req.body.passwd,
                user.passwd
            );
            if (!isPasswdValid) throw new Error();
            const token = createToken({
                id: user.id.toString(),
                name: user.name,
                role: user.role,
            });
            resp.json({ token });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    #createHttpError(error: Error) {
        if ((error as Error).message === 'Not found id') {
            const httpError = new HTTPError(
                404,
                'Not Found',
                (error as Error).message
            );
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            (error as Error).message
        );
        return httpError;
    }
}
