import { Robot } from './robot';

export type ProtoUser = {
    name?: string;
    email?: string;
    passwd?: string;
    role?: string;
    robots?: Array<Robot>;
};

export type User = {
    id: string;
    name: string;
    email: string;
    passwd: string;
    role: string;
    robots: Array<Robot>;
};
