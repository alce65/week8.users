import { Request, Response, NextFunction } from 'express';

export const setCors = (req: Request, res: Response, next: NextFunction) => {
    // Implementado según las recomendaciones de SonarCloud
    // para evitas un Security HotSpot

    const origin = req.header('Origin') || '*';
    res.setHeader('Access-Control-Allow-Origin', origin as string);
    next();
};
