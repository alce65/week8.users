import createDebug from 'debug';
import mongoose, { model, Types } from 'mongoose';
import { Robot, ProtoRobot } from '../entities/robot.js';
import { robotSchema } from '../entities/robot.js';
import { Repo, id } from './repo.js';
const debug = createDebug('W8:repositories:robot');

export class RobotRepository implements Repo<Robot> {
    #Model = model('Robot', robotSchema, 'robots');
    constructor() {
        debug('instance');
    }

    async getAll(): Promise<Array<Robot>> {
        debug('getAll');
        return this.#Model.find().populate('owner', {
            robots: 0,
        });
    }
    async get(id: id): Promise<Robot> {
        debug('get', id);
        const result = await this.#Model
            .findById(id)
            .populate<{ _id: Types.ObjectId }>('owner', {
                robots: 0,
            });
        if (!result) throw new Error('Not found id');
        return result as Robot;
    }

    async find(search: {
        [key: string]: string | number | Date;
    }): Promise<Robot> {
        debug('find', { search });
        const result = await this.#Model.findOne(search).populate('owner', {
            robots: 0,
        }); //as Robot;
        if (!result) throw new Error('Not found id');
        return result as unknown as Robot;
    }

    async post(data: ProtoRobot): Promise<Robot> {
        debug('post', data);
        data.date = this.#generateDate(data.date as string);
        const result = await (
            await this.#Model.create(data)
        ).populate('owner', {
            robots: 0,
        });
        return result as Robot;
    }
    async patch(id: id, data: Partial<Robot>): Promise<Robot> {
        debug('patch', id);
        const result = await this.#Model
            .findByIdAndUpdate(id, data, {
                new: true,
            })
            .populate('owner', {
                robots: 0,
            });
        if (!result) throw new Error('Not found id');
        return result as Robot;
    }

    async delete(id: id): Promise<id> {
        debug('delete', id);
        const result = await this.#Model
            .findByIdAndDelete(id)
            .populate('owner', {
                robots: 0,
            });
        if (result === null) throw new Error('Not found id');
        return id;
    }

    #disconnect() {
        mongoose.disconnect();
        debug(mongoose.connection.readyState);
    }

    #generateDate(date: string | undefined) {
        if (!date) return new Date();
        const validDate =
            new Date(date) === new Date('') ? new Date() : new Date(date);
        return validDate;
    }

    getModel() {
        return this.#Model;
    }
}
