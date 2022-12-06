import createDebug from 'debug';
import { User } from '../entities/user.js';
import { passwdEncrypt } from '../services/auth.js';
import { Repo, id } from './repo.js';
import { UserModel } from './user.model.js';
const debug = createDebug('W8:repositories:user');

export class UserRepository implements Repo<User> {
    static instance: UserRepository;

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    #Model = UserModel;
    private constructor() {
        debug('instance');
    }

    async search(): Promise<Array<User>> {
        debug('getAll');
        const result = this.#Model.find();
        return result;
    }

    async queryId(id: id): Promise<User> {
        debug('get', id);
        const result = await this.#Model.findById(id); //as User;
        if (!result) throw new Error('Not found id');
        return result;
    }

    async create({ ...data }: Partial<User>): Promise<User> {
        debug('post', data);
        if (!data.passwd || typeof data.passwd !== 'string')
            throw new Error('');
        data.passwd = await passwdEncrypt(data.passwd);
        const result = await this.#Model.create(data);
        return result;
    }

    async query(query: Partial<User>): Promise<User> {
        debug('find', { search: query });
        const result = await this.#Model.findOne(query); //as User;
        if (!result) throw new Error('Not found id');
        return result;
    }

    async update(id: id, data: Partial<User>): Promise<User> {
        debug('patch', id);
        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) throw new Error('Not found id');
        return result;
    }

    async delete(id: id): Promise<id> {
        debug('delete', id);
        const result = await this.#Model.findByIdAndDelete(id);
        // Cuando el ID es valido pero NO se encuentra
        // la query (like-promise) de findByIdAndDelete
        // NO se resuelve a undefined / null
        // En su lugar se lanza un PoolClosedError
        // if (result === null) throw new Error('Not found id');
        return (result as User).id;
    }

    getModel() {
        return this.#Model;
    }
}
