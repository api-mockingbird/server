import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import logger from 'morgan';
import path from 'path';

import { FIVE_MINUTES } from './constants';
import indexRouter from './routes/index';
import { User } from './types';

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

const app = express();

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: FIVE_MINUTES,
  max: (req) => {
    const { originalUrl, subdomains } = req;
    const subdomain = subdomains[0];

    if (
      (subdomain === 'www' || subdomain === 'app') &&
      originalUrl === '/graphql'
    ) {
      return 100;
    }

    return 30;
  },
});

if (process.env.NODE_ENV !== 'development') {
  app.use(limiter);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

export default app;
