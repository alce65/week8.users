import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../interfaces/error';
import { ExtraRequest } from '../interfaces/extra.request';
import { RobotRepository } from '../repositories/robot.repo';
import { UserRepository } from '../repositories/user.repo';
import { UserController } from './user';
import { createToken, passwdValidate } from '../services/auth.js';

jest.mock('../services/auth.js');

describe('Given UserController', () => {
    // Instancias de los repositorios y mock de sus funciones
    const repository = UserRepository.getInstance();
    const roboRepo = RobotRepository.getInstance();
    repository.query = jest.fn();
    repository.create = jest.fn();
    // Instancia del controller inyectándole los mock-repos
    const userController = new UserController(repository, roboRepo);
    // Mock de los objetos/funciones de Express: req, resp, next
    let req: Partial<ExtraRequest>;
    let resp: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: {} };
        resp = {};
        resp.json = jest.fn().mockReturnValue(resp);
        resp.status = jest.fn().mockReturnValue(resp);
        next = jest.fn();
    });

    describe('When method register is called', () => {
        const mockUser = { name: 'Pepe' };
        test('Then if the data in the body are VALID, resp.json should be called ', async () => {
            (repository.create as jest.Mock).mockResolvedValue(mockUser);
            // act
            await userController.register(
                req as Request,
                resp as Response,
                next
            );
            // assert
            expect(resp.json).toHaveBeenCalledWith({ user: mockUser });
        });
        test('Then if the data in the body are NOT VALID, next should be called', async () => {
            // Mocks de las respuestas del repositorio: usuario no válido
            (repository.create as jest.Mock).mockRejectedValue(new Error());
            // act
            await userController.register(
                req as Request,
                resp as Response,
                next
            );
            // assert
            expect(next).toHaveBeenCalled();
        });
    });

    describe('When method login is called', () => {
        test('Then, if is a VALID login, resp.json should be called', async () => {
            const mockUser = { id: '1', name: 'Pepe', role: 'admin' };
            const mockToken = 'Bearer token';
            // Mocks de las respuestas del repositorio: usuario encontrado
            repository.query = jest.fn().mockResolvedValue(mockUser);
            (passwdValidate as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue(mockToken);
            // act
            await userController.login(req as Request, resp as Response, next);
            // assert
            expect(resp.json).toHaveBeenCalledWith({ token: mockToken });
        });
        test('Then, if there is a NOT VALID user (bad ID), next should be called', async () => {
            repository.query = jest
                .fn()
                .mockRejectedValue(new Error('Not found id'));
            // act
            await userController.login(req as Request, resp as Response, next);
            // assert
            expect(next).toHaveBeenCalledWith(
                new HTTPError(404, 'Not Found', 'Not found id')
            );
        });

        test('Then, if there is a NOT VALID passwd, next should be called', async () => {
            const mockUser = { id: '1', name: 'Pepe', role: 'admin' };
            repository.query = jest.fn().mockResolvedValue(mockUser);
            (passwdValidate as jest.Mock).mockResolvedValue(false);
            // act
            await userController.login(req as Request, resp as Response, next);
            // assert
            expect(next).toHaveBeenCalledWith(new Error());
        });
        test('Then, if is a NOT VALID login, resp.json should be called', async () => {
            //
        });
    });
});
