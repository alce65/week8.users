import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}
