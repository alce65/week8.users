import { Router } from 'express';
import { RobotRepository } from '../repositories/robot.js';
import { RobotController } from '../controllers/robot.js';
import { logged } from '../middlewares/interceptors.js';

export const robotsRouter = Router();
const controller = new RobotController(new RobotRepository());

robotsRouter.get('/', logged, controller.getAll.bind(controller));
robotsRouter.get('/:id', controller.get.bind(controller));
robotsRouter.post('/', controller.post.bind(controller));
robotsRouter.patch('/:id', controller.patch.bind(controller));
robotsRouter.delete('/:id', controller.delete.bind(controller));
