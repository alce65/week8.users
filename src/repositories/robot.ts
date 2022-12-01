import createDebug from 'debug';
import { model, Schema, Types } from 'mongoose';
import { Robot, ProtoRobot } from '../entities/robot.js';
import { Repo, id } from './repo.js';
const debug = createDebug('W8:repositories:robot');

const robotsImagesURL = 'https://robohash.org';

export const robotSchema = new Schema<Robot>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        set: (name: string) => `${robotsImagesURL}/${name}`,
    },
    speed: { type: Number, min: 0, max: 10 },
    resistance: { type: Number, min: 0, max: 10 },
    date: Date,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

robotSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
    },
});

export class RobotRepository implements Repo<Robot> {
    //
    static instance: RobotRepository;

    public static getInstance(): RobotRepository {
        if (!RobotRepository.instance) {
            RobotRepository.instance = new RobotRepository();
        }
        return RobotRepository.instance;
    }

    #Model = model<Robot>('Robot', robotSchema, 'robots');

    private constructor() {
        debug('instance');
    }

    async getAll(): Promise<Array<Robot>> {
        debug('getAll');
        const result = this.#Model.find().populate('owner', {
            robots: 0,
        });
        return result;
    }
    async get(id: id): Promise<Robot> {
        debug('get', id);
        const result = await this.#Model
            .findById(id)
            .populate<{ _id: Types.ObjectId }>('owner');
        if (!result) throw new Error('Not found id');
        return result;
    }

    async find(search: Partial<Robot>): Promise<Robot> {
        debug('find', { search });
        const result = await this.#Model.findOne(search).populate('owner', {
            robots: 0,
        }); //as Robot;
        if (!result) throw new Error('Not found id');
        return result;
    }

    async post(data: ProtoRobot): Promise<Robot> {
        debug('post', data);
        data.date = this.#generateDate(data.date as string);
        const result = await (
            await this.#Model.create(data)
        ).populate('owner', {
            robots: 0,
        });
        return result;
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
        return result;
    }

    async delete(id: id): Promise<id> {
        debug('delete', id);
        const result = await this.#Model
            .findByIdAndDelete(id)
            .populate('owner', {
                robots: 0,
            });
        if (!result) throw new Error('Not found id');
        return id;
    }

    #generateDate(date: string | undefined) {
        if (!date) return new Date();
        const d = new Date(date);
        return isNaN(d.getTime()) ? new Date() : d;
    }

    getModel() {
        return this.#Model;
    }
}
