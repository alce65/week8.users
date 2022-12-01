import { Types } from 'mongoose';

export type ProtoUser = {
    name?: string;
    email?: string;
    passwd?: string;
    role?: string;
    robots?: Array<Types.ObjectId>;
};

export type User = {
    id: Types.ObjectId;
    name: string;
    email: string;
    passwd: string;
    role: string;
    robots: Array<Types.ObjectId>;
};
