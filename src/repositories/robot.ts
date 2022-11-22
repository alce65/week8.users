import mongoose, { model } from 'mongoose';
import { Robot, ProtoRobot } from '../entities/robot.js';
import { robotSchema } from '../entities/robot.js';
import { Repo, id } from './repo.js';

export class RobotRepository implements Repo<Robot> {
    #Model = model('Robot', robotSchema, 'robots');

    async getAll(): Promise<Array<Robot>> {
        return this.#Model.find();
    }
    async get(id: id): Promise<Robot> {
        const result = await this.#Model.findById(id); //as Coffee;
        if (!result) throw new Error('Not found id');
        return result as Robot;
    }

    async find(search: {
        [key: string]: string | number | Date;
    }): Promise<Robot> {
        console.log(search);
        const result = await this.#Model.findOne(search); //as Robot;
        if (!result) throw new Error('Not found id');
        return result as unknown as Robot;
    }

    async post(data: ProtoRobot): Promise<Robot> {
        data.date = this.#generateDate(data.date as string);
        const result = await this.#Model.create(data);
        return result as Robot;
    }
    async patch(id: id, data: Partial<Robot>): Promise<Robot> {
        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) throw new Error('Not found id');
        return result as Robot;
    }

    async delete(id: id): Promise<id> {
        const result = await this.#Model.findByIdAndDelete(id);
        if (result === null) throw new Error('Not found id');
        return id;
    }

    #disconnect() {
        mongoose.disconnect();
        console.log(mongoose.connection.readyState);
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
