import { PrismaClient } from '@prisma/client';
import { AuthenticationError } from 'apollo-server-errors';
import { Request, Response } from 'express';

import app from './app';
import { authenticate } from './auth';
import db from './db';
import { getUserById } from './service/user';
import { User } from './types';
import { decode } from './utils/jwt';

export interface Context {
  db: PrismaClient;
  user: User | null;
  req: Request;
  res: Response;
}

export const createContext = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) => {
  const { cookies } = req;
  const { accessToken } = cookies;
  const context: Context = {
    db,
    user: null,
    req,
    res,
  };

  if (accessToken) {
    try {
      const authenticatedUser = (await authenticate(accessToken)) as User;

      context.user = authenticatedUser;
    } catch (e) {
      throw e;
    }
  }

  return context;
};
