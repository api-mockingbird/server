import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { BadRequest, MethodNotAllowed, NotFound } from 'http-errors';

import { FIVE_MINUTES, ONE_HOUR } from '../constants';
import db from '../db';
import { getMockEndpointByRequestInfo } from '../service/mock-endpoint.service';
import { getUserById } from '../service/user.service';
import { HttpMethod } from '../types';
import sleep from '../utils/sleep';

const router = express.Router();

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

if (process.env.NODE_ENV === 'production') {
  router.use(limiter);
}

router.all('/*', async (req: Request, res: Response, next: NextFunction) => {
  const { params, subdomains, method } = req;
  const urlPath = `/${params['0']}`;
  const subdomain = subdomains[0];
  const availableMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

  if (subdomains.length > 1) {
    return next(new BadRequest());
  }

  if (
    subdomain === 'www' ||
    subdomain === 'app' ||
    (process.env.NODE_ENV !== 'production' && urlPath === '/graphql')
  ) {
    return next();
  }

  if (!availableMethods.includes(method)) {
    return next(new MethodNotAllowed());
  }

  const mockEndpoint = await getMockEndpointByRequestInfo(db, {
    userId: subdomain,
    httpMethod: method as HttpMethod,
    urlPath,
  });

  if (!mockEndpoint) {
    return next(new NotFound());
  }

  const user = await getUserById(db, mockEndpoint.userId);

  if (
    user!.isTemp &&
    new Date(user!.createdAt) < new Date(Date.now() - ONE_HOUR)
  ) {
    return next(new NotFound());
  }

  res.status(mockEndpoint.httpStatus);

  if (mockEndpoint.httpHeaders) {
    res.set(JSON.parse(mockEndpoint.httpHeaders));
  }

  res.type(mockEndpoint.responseContentType);

  if (mockEndpoint.timeout) {
    await sleep(mockEndpoint.timeout);
  }

  try {
    const body = JSON.parse(mockEndpoint.httpResponseBody);

    res.send(body);
  } catch {
    res.send(mockEndpoint.httpResponseBody);
  }
});

export default router;
