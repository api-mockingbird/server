import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

const prisma = new PrismaClient();

export const context = ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Context => {
  return {
    prisma,
    req,
    res,
  };
};
