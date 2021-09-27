import { PrismaClient } from '@prisma/client';

import { NexusGenInputs } from '../generated/nexus';

export const createUser = (
  db: PrismaClient,
  data: NexusGenInputs['UserCreateInput'] | null | undefined,
) => {
  return db.user.create({
    data: {
      id: data?.id ?? undefined,
      isTemp: data?.isTemp ?? undefined,
    },
  });
};

export const getUserById = (db: PrismaClient, id: string) => {
  return db.user.findUnique({
    where: { id },
  });
};

export const deleteUserById = (db: PrismaClient, id: string) => {
  return db.user.delete({
    where: { id },
  });
};
