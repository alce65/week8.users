import createDebug from 'debug';
import mongoose, { Types } from 'mongoose';
import { RobotI, ProtoRobotI } from '../entities/robot.js';
import { Robot } from '../entities/robot.js';
import { Repo, id } from './repo.js';
const debug = createDebug('W8:repositories:robot');

export class RobotRepository implements Repo<RobotI> {
    static instance: RobotRepository;

    public static getInstance(): RobotRepository {
        if (!RobotRepository.instance) {
            RobotRepository.instance = new RobotRepository();
        }
        return RobotRepository.instance;
    }

    #Model = Robot;

    private constructor() {
        debug('instance');
    }

    async getAll(): Promise<Array<RobotI>> {
        debug('getAll');
        return this.#Model.find().populate('owner', {
            robots: 0,
        });
    }
    async get(id: id): Promise<RobotI> {
        debug('get', id);
        const result = await this.#Model
            .findById(id)
            .populate<{ _id: Types.ObjectId }>('owner');
        if (!result) throw new Error('Not found id');
        return result;
    }

    async find(search: Partial<RobotI>): Promise<RobotI> {
        debug('find', { search });
        const result = await this.#Model.findOne(search).populate('owner', {
            robots: 0,
        }); //as Robot;
        if (!result) throw new Error('Not found id');
        return result;
    }

    async post(data: ProtoRobotI): Promise<RobotI> {
        debug('post', data);
        data.date = this.#generateDate(data.date as string);
        const result = await (
            await this.#Model.create(data)
        ).populate('owner', {
            robots: 0,
        });
        return result;
    }
    async patch(id: id, data: Partial<RobotI>): Promise<RobotI> {
        debug('patch', id);
        const result = await this.#Model
            .findByIdAndUpdate(id, data, {
                new: true,
            })
            .populate('owner', {
                robots: 0,
            });
        if (!result) throw new Error('Not found id');
        return result;
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
