import { Schema, Types } from 'mongoose';

const robotsImagesURL = 'https://robohash.org';

export type ProtoRobot = {
    name?: string;
    image?: string;
    speed?: number;
    resistance?: number;
    date?: string | Date;
    owner?: Types.ObjectId;
};

export type Robot = {
    name: string;
    image: string;
    speed: number;
    resistance: number;
    date: Date;
    owner: Types.ObjectId;
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

// export const Robot = model<Robot>('Robot', robotSchema, 'robots');
