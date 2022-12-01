import createDebug from 'debug';
import { model, Schema } from 'mongoose';
import { User } from '../entities/user.js';
import { passwdEncrypt } from '../services/auth.js';
import { Repo, id } from './repo.js';
const debug = createDebug('W8:repositories:user');

export const userSchema = new Schema<User>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: String,
    passwd: String,
    role: String,
    robots: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Robots',
        },
    ],
});

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.passwd;
    },
});

export class UserRepository implements Repo<User> {
    static instance: UserRepository;

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    #Model = model<User>('User', userSchema, 'users');
    private constructor() {
        debug('instance');
    }

    async getAll(): Promise<Array<User>> {
        debug('getAll');
        const result = this.#Model.find();
        return result;
    }

    async get(id: id): Promise<User> {
        debug('get', id);
        const result = await this.#Model.findById(id); //as User;
        if (!result) throw new Error('Not found id');
        return result;
    }

    async post({ ...data }: Partial<User>): Promise<User> {
        debug('post', data);
        if (!data.passwd || typeof data.passwd !== 'string')
            throw new Error('');
        data.passwd = await passwdEncrypt(data.passwd);
        const result = await this.#Model.create(data);
        return result;
    }

    async find(search: Partial<User>): Promise<User> {
        debug('find', { search });
        const result = await this.#Model.findOne(search); //as User;
        if (!result) throw new Error('Not found id');
        return result;
    }

    async patch(id: id, data: Partial<User>): Promise<User> {
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
        if (result === null) throw new Error('Not found id');
        return id;
    }

    getModel() {
        return this.#Model;
    }
}
