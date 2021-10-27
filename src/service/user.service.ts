import { PrismaClient } from '@prisma/client';

import { UserCreateInput } from '../types';
import { TWELVE_HOURS } from '../constants';

export const createUser = (
  db: PrismaClient,
  data: UserCreateInput | null | undefined,
) => {
  try {
    return db.user.create({
      data: {
        id: data?.id ?? undefined,
        isTemp: data?.isTemp ?? undefined,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const getUserById = (db: PrismaClient, id: string) => {
  try {
    return db.user.findUnique({
      where: { id },
    });
  } catch (e) {
    throw e;
  }
};

export const removeUserById = (db: PrismaClient, id: string) => {
  try {
    return db.user.delete({
      where: { id },
    });
  } catch (e) {
    throw e;
  }
};

export const removeOldTempUsers = (db: PrismaClient) => {
  try {
    return db.user.deleteMany({
      where: {
        isTemp: true,
        createdAt: {
          lt: new Date(Date.now() - TWELVE_HOURS),
        },
      },
    });
  } catch (e) {
    throw e;
  }
};
