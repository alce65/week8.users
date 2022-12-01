import { Robot } from '../entities/robot';
import { User } from '../entities/user';

export type id = number | string; //Types.ObjectId;

// Interface Segregation
// No se usa en nuestro proyecto
export interface BasicRepo<T> {
    get: (id: id) => Promise<T>;
    post: (data: Partial<T>) => Promise<T>;
    find: (data: Partial<T>) => Promise<T>;
}

// La segregación de interfaces podría utilizar un segundo interfaz complementario
// que no se usa en nuestro proyecto
export interface ExtraRepo<T> {
    getAll: () => Promise<Array<T>>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}

export interface Repo<T> extends BasicRepo<T> {
    getAll: () => Promise<Array<T>>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}
