import { UserCreateInput } from '../types';
import { PrismaClient } from '@prisma/client';

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

export const deleteUserById = (db: PrismaClient, id: string) => {
  try {
    return db.user.delete({
      where: { id },
    });
  } catch (e) {
    throw e;
  }
};
