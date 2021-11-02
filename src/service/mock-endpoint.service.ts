import { PrismaClient } from '@prisma/client';
import { UserInputError } from 'apollo-server-errors';

import { TooManyMockEndpointsError } from '../errors';
import { HttpMethod, MockEndpointInput } from '../types';
import { getUserById } from './user.service';

export const createMockEndpoint = async (
  db: PrismaClient,
  userId: string,
  data: MockEndpointInput,
) => {
  try {
    const mockEndpoints = await db.mockEndpoint.findMany({
      where: { userId },
    });

    if (mockEndpoints.length >= 10) {
      throw new TooManyMockEndpointsError(
        'Number of endpoints has reached the limit',
      );
    }

    if (
      mockEndpoints.some((endpoint) => {
        return (
          endpoint.httpMethod === data.httpMethod &&
          endpoint.urlPath === data.urlPath
        );
      })
    ) {
      throw new UserInputError('Mock endpoint already exists');
    }
  } catch (e) {
    throw e;
  }

  try {
    return db.mockEndpoint.create({
      data: {
        userId,
        ...data,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const updateMockEndpoint = (
  db: PrismaClient,
  userId: string,
  data: MockEndpointInput,
) => {
  try {
    return db.mockEndpoint.update({
      where: { id: data.id },
      data: {
        userId,
        ...data,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const getMockEndpointsByUserId = (db: PrismaClient, userId: string) => {
  try {
    return getUserById(db, userId).mockEndpoints();
  } catch (e) {
    throw e;
  }
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

export const getMockEndpointByRequestInfo = (
  db: PrismaClient,
  requestInfo: { userId: string; httpMethod: HttpMethod; urlPath: string },
) => {
  try {
    return db.mockEndpoint.findFirst({
      where: requestInfo,
    });
  } catch (e) {
    throw e;
  }
};

export const removeMockEndpointById = (db: PrismaClient, id: number) => {
  try {
    return db.mockEndpoint.delete({
      where: { id },
    });
  } catch (e) {
    throw e;
  }
};
