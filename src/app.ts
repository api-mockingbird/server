import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import { NexusGenObjects } from './generated/nexus';
import { authenticateRequest } from './auth';

declare global {
  namespace Express {
    interface Request {
      user: NexusGenObjects['User'] | null;
    }
  }
}

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authenticateRequest);

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
