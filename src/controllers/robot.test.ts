import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../interfaces/error';
import { ExtraRequest } from '../interfaces/extra.request';
import { RobotRepository } from '../repositories/robot.repo';
import { UserRepository } from '../repositories/user.repo';
import { RobotController } from './robot';

// jest.mock('../repositories/robot');

describe('Given RobotController', () => {
    // Instancias de los repositorios y mock de sus funciones
    const repository = RobotRepository.getInstance();
    const userRepo = UserRepository.getInstance();
    repository.search = jest.fn();
    repository.queryId = jest.fn();
    repository.create = jest.fn();
    repository.update = jest.fn();
    repository.delete = jest.fn();
    userRepo.queryId = jest.fn();
    userRepo.update = jest.fn();
    // Instancia del controller inyectándole los mock-repos
    const robotController = new RobotController(repository, userRepo);
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

    describe('When method getALL is called', () => {
        const mockRobots = [{ id: 1, name: 'bot' }];
        test('Then if repository found data , resp.json should be called', async () => {
            (repository.search as jest.Mock).mockResolvedValue(mockRobots);
            await robotController.getAll(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith({ robots: mockRobots });
        });
        test('Then if repository throw an error, resp.next should be called', async () => {
            (repository.search as jest.Mock).mockRejectedValue(
                new Error('Error')
            );
            await robotController.getAll(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(
                new HTTPError(503, 'Service unavailable', 'Error')
            );
        });
    });

    describe('When method get is called', () => {
        const mockRobot = { id: 1, name: 'bot' };
        test('Then if the id is VALID , resp.json should be called', async () => {
            // Datos que llegarían en la request
            req.params = { id: '1' };
            (repository.queryId as jest.Mock).mockResolvedValue(mockRobot);
            await robotController.get(req as Request, resp as Response, next);
            expect(resp.json).toHaveBeenCalledWith({ robot: mockRobot });
        });
        test('Then if the id is NOT VALID, next should be called', async () => {
            // Datos que llegarían en la request
            req.params = { id: 'bad' };
            (repository.queryId as jest.Mock).mockRejectedValue(
                new Error('Error')
            );
            await robotController.get(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalledWith(
                new HTTPError(503, 'Service unavailable', 'Error')
            );
        });
        test('Then if the id is NOT FOUND, next should be called', async () => {
            // Datos que llegarían en la request
            req.params = { id: '21' };
            (repository.queryId as jest.Mock).mockRejectedValue(
                new Error('Not found id')
            );
            await robotController.get(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalledWith(
                new HTTPError(404, 'Not Found', 'Not found id')
            );
        });
    });

    describe('When method post is called', () => {
        const mockRobot = { name: 'bot' };
        test('Then if the data in the body are VALID, resp.send should be called', async () => {
            // Datos que llegarían en la request
            req.payload = { name: 'user' };
            req.body = { name: 'bot' };
            // Mocks de las respuestas de los repositorios
            (userRepo.queryId as jest.Mock).mockResolvedValue({
                id: '1',
                name: 'user',
                robots: [],
            });
            (repository.create as jest.Mock).mockResolvedValue(mockRobot);
            // act
            await robotController.post(req as Request, resp as Response, next);
            // assert
            expect(resp.json).toHaveBeenCalledWith({ robot: mockRobot });
        });

        test('Then if there are NOT user data (in the payload), next should be called', async () => {
            // act
            await robotController.post(req as Request, resp as Response, next);
            // assert
            expect(next).toHaveBeenCalled();
        });

        test('Then if there are NOT data in the body, next should be called', async () => {
            // Mocks de las respuestas del repositorio: usuario no encontrado
            (userRepo.queryId as jest.Mock).mockRejectedValue(new Error());
            // act
            await robotController.post(req as Request, resp as Response, next);
            // assert
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method patch is called', () => {
        const mockRobot = { name: 'update bot' };
        test('Then if the data in the body are VALID, resp.send should be called', async () => {
            // Datos que llegarían en la request
            req.params = { id: '1' };
            req.body = mockRobot;
            // Mocks de las respuestas de los repositorios
            (repository.update as jest.Mock).mockResolvedValue(mockRobot);
            // act
            await robotController.patch(req as Request, resp as Response, next);
            // assert
            expect(resp.json).toHaveBeenCalledWith({ robot: mockRobot });
        });
        test('Then if there are NOT data in the body, next should be called', async () => {
            //(repository.update as jest.Mock).mockResolvedValue(mockRobot);
            await robotController.patch(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalled();
        });
        test('Then if the id is NOT FOUND, next should be called', async () => {
            // Datos que llegarían en la request
            req.params = { id: '21' };
            (repository.update as jest.Mock).mockRejectedValue(
                new Error('Not found id')
            );
            await robotController.patch(req as Request, resp as Response, next);
            expect(next).toHaveBeenCalledWith(
                new HTTPError(404, 'Not Found', 'Not found id')
            );
        });
    });
    describe('When method delete is called', () => {
        test('Then if the data in the body are VALID, resp.send should be called', async () => {
            // Datos que llegarían en la request
            req.params = { id: '1' };
            // Mocks de las respuestas de los repositorios
            (repository.delete as jest.Mock).mockResolvedValue({});
            // act
            await robotController.delete(
                req as Request,
                resp as Response,
                next
            );
            // assert
            expect(resp.json).toHaveBeenCalledWith({});
        });
        test('Then if there aer NOT data in the body, next should be called', async () => {
            //(repository.update as jest.Mock).mockResolvedValue(mockRobot);
            await robotController.delete(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
        test('Then if the id is NOT FOUND, next should be called', async () => {
            // Datos que llegarían en la request
            req.params = { id: '21' };
            (repository.delete as jest.Mock).mockRejectedValue(
                new Error('Not found id')
            );
            await robotController.delete(
                req as Request,
                resp as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(
                new HTTPError(404, 'Not Found', 'Not found id')
            );
        });
    });
});
