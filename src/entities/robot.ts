import { Types } from 'mongoose';

export type ProtoRobot = {
    name?: string;
    image?: string;
    speed?: number;
    resistance?: number;
    date?: string | Date;
    owner?: Types.ObjectId;
};

export type Robot = {
    id: Types.ObjectId;
    name: string;
    image: string;
    speed: number;
    resistance: number;
    date: Date;
    owner: Types.ObjectId;
};
