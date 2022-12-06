import { Router } from 'express';
import { RobotRepository } from '../repositories/robot.repo.js';
import { RobotController } from '../controllers/robot.js';
import { logged, who } from '../interceptors/logged.js';
import { UserRepository } from '../repositories/user.repo.js';

export const robotsRouter = Router();
const controller = new RobotController(
    RobotRepository.getInstance(),
    UserRepository.getInstance()
);

robotsRouter.get('/', controller.getAll.bind(controller));
robotsRouter.get('/:id', controller.get.bind(controller));
robotsRouter.post('/', logged, controller.post.bind(controller));
robotsRouter.patch('/:id', logged, who, controller.patch.bind(controller));
robotsRouter.delete('/:id', logged, who, controller.delete.bind(controller));
