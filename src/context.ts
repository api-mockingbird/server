import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

import db from './db';

export interface Context {
  db: PrismaClient;
  req: Request;
  res: Response;
}

export const context = ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Context => {
  return {
    db,
    req,
    res,
  };
};
