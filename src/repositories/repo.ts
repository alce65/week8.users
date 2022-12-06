export type id = number | string;

// Interface Segregation
// No se usa en nuestro proyecto
export interface BasicRepo<T> {
    queryId: (id: id) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    query: (data: Partial<T>) => Promise<T>;
}

// La segregación de interfaces podría utilizar un segundo interfaz complementario
// que no se usa en nuestro proyecto
export interface ExtraRepo<T> {
    search: () => Promise<Array<T>>;
    update: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}

export interface Repo<T> extends BasicRepo<T> {
    search: () => Promise<Array<T>>;
    update: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<id>;
}
