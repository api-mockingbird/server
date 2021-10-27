import db from '../db';
import { getMockEndpointByRequestInfo } from '../service/mock-endpoint.service';
import { HttpMethod } from '../types';
import sleep from '../utils/sleep';
import express, { NextFunction, Request, Response } from 'express';
import { BadRequest, MethodNotAllowed, NotFound } from 'http-errors';

const router = express.Router();

router.all('/*', async (req: Request, res: Response, next: NextFunction) => {
  const { params, subdomains, method } = req;
  const urlPath = `/${params['0']}`;
  const subdomain = subdomains[0];
  const availableMethods = ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS'];

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

  console.log(mockEndpoint);

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
