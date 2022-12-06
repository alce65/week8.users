import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Repo } from '../repositories/repo.js';
import { Robot } from '../entities/robot.js';
import { User } from '../entities/user.js';
import { HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../interfaces/extra.request.js';

const debug = createDebug('W8:controllers:robot');

export class RobotController {
    constructor(
        public readonly repository: Repo<Robot>,
        public readonly userRepo: Repo<User>
    ) {
        debug('instance');
    }
    async getAll(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('getAll');
            const robots = await this.repository.search();
            resp.json({ robots });
        } catch (error) {
            const httpError = this.#createHttpError(error as Error);
            next(httpError);
        }
    }

    async get(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('get');
            const robot = await this.repository.queryId(req.params.id);
            resp.json({ robot });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async post(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('post');
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            const user = await this.userRepo.queryId(req.payload.id);
            req.body.owner = user.id;
            const robot = await this.repository.create(req.body);

            // repo usuarios user + robot
            user.robots.push(robot);
            this.userRepo.update(user.id, {
                robots: user.robots,
            });
            resp.status(201).json({ robot });
        } catch (error) {
            const httpError = this.#createHttpError(error as Error);
            next(httpError);
        }
    }

    async patch(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('patch');
            const robot = await this.repository.update(req.params.id, req.body);
            resp.json({ robot });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async delete(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('delete');
            await this.repository.delete(req.params.id);
            resp.json({});
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
