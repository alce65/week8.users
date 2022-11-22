import { Schema } from 'mongoose';

const robotsImagesURL = 'https://robohash.org';

export type ProtoRobot = {
    name?: string;
    image?: string;
    speed?: number;
    resistance?: number;
    date?: string | Date;
};

export type Robot = {
    id: string;
    name: string;
    image: string;
    speed: number;
    resistance: number;
    date: Date;
};

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
});

robotSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
    },
});
