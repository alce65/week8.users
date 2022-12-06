import createDebug from 'debug';
import { Robot, ProtoRobot } from '../entities/robot.js';
import { Repo, id } from './repo.js';
import { RobotModel } from './robot.model.js';
const debug = createDebug('W8:repositories:robot');

export class RobotRepository implements Repo<Robot> {
    //
    static instance: RobotRepository;

    public static getInstance(): RobotRepository {
        if (!RobotRepository.instance) {
            RobotRepository.instance = new RobotRepository();
        }
        return RobotRepository.instance;
    }

    #Model = RobotModel;

    private constructor() {
        debug('instance');
    }

    async search(): Promise<Array<Robot>> {
        debug('getAll');
        const result = this.#Model
            .find()
            .populate('owner', {
                robots: 0,
            })
            .exec();
        return result;
    }
    async queryId(id: id): Promise<Robot> {
        debug('get', id);
        const result = await this.#Model.findById(id).populate('owner').exec();
        if (!result) throw new Error('Not found id');
        return result;
    }

    async query(query: Partial<Robot>): Promise<Robot> {
        debug('find', { search: query });
        const result = await this.#Model
            .findOne(query)
            .populate('owner', {
                robots: 0,
            })
            .exec(); //as Robot;
        // Cuando el ID es valido pero no se encuentra
        // la query (like-promise) de findOne se resuelve a undefined / null
        if (!result) throw new Error('Not found id');
        return result;
    }

    async create(data: ProtoRobot): Promise<Robot> {
        debug('post', data);
        data.date = this.#generateDate(data.date as string);
        const result = await (
            await this.#Model.create(data)
        ).populate('owner', {
            robots: 0,
        });
        return result;
    }
    async update(id: id, data: Partial<Robot>): Promise<Robot> {
        debug('patch', id);
        const result = await this.#Model
            .findByIdAndUpdate(id, data, { new: true })
            .populate('owner', {
                robots: 0,
            })
            .exec();
        // Cuando el ID es valido pero no se encuentra
        // la query (like-promise) de findByIdAndUpdate
        // se resuelve a undefined / null
        if (!result) throw new Error('Not found id');
        return result;
    }

    async delete(id: id): Promise<id> {
        debug('delete', id);
        const result = await this.#Model
            .findByIdAndDelete(id)
            .populate('owner', {
                robots: 0,
            })
            .exec();
        // Cuando el ID es valido pero NO se encuentra
        // la query (like-promise) de findByIdAndDelete
        // NO se resuelve a undefined / null
        // En su lugar se lanza un PoolClosedError
        // if (!result) throw new Error('Not found id');
        return (result as Robot).id;
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
