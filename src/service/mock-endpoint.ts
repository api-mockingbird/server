import { PrismaClient } from '@prisma/client';

import { NexusGenInputs } from '../generated/nexus';
import { getUserById } from './user';

export const createMockEndpoint = (
  db: PrismaClient,
  userId: string,
  data: NexusGenInputs['MockEndpointCreateInput'],
) => {
  return db.mockEndpoint.create({
    data: {
      userId,
      ...data,
    },
  });
};

export const getMockEndpointsByUserId = (db: PrismaClient, userId: string) => {
  return getUserById(db, userId).mockEndpoints();
};

export const getMockEndpointById = (db: PrismaClient, id: number) => {
  try {
    return db.mockEndpoint.findUnique({
      where: { id },
    });
  } catch (e) {
    throw e;
  }
};
