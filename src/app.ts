import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorManager } from './middlewares/errors.js';
import { setCors } from './middlewares/cors.js';
import { usersRouter } from './routers/users.js';

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
    origin: '*',
};
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.use(setCors);

app.get('/', (_req, res) => {
    res.send('API Express de robots -> /robots').end();
});

// Ejemplo con FS
app.use('/users', usersRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(errorManager);
