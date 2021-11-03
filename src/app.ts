import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { TooManyRequests } from 'http-errors';
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

    if (subdomain === 'api' && originalUrl === '/graphql') {
      return 120;
    }

    return 30;
  },
  handler: (req, res, next) => {
    if (req.method === 'OPTIONS') return next();

    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_BASE_URL!);
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next(new TooManyRequests());
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
