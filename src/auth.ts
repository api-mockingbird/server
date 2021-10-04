import { Request, Response, NextFunction } from 'express';

import { decode } from './utils/jwt';
import { User } from './types';

export const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { originalUrl, cookies } = req;

  // add conditions for subdomains
  if (originalUrl !== '/graphql') {
    return next();
  }

  const { accessToken } = cookies;

  if (!accessToken) {
    req.user = null;

    return next();
  }

  const decoded = decode(accessToken);

  req.user = decoded as User;

  next();
};
