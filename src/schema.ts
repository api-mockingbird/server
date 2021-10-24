import { DateTimeResolver } from 'graphql-scalars';
import {
  arg,
  asNexusMethod,
  enumType,
  inputObjectType,
  intArg,
  makeSchema,
  mutationType,
  nonNull,
  objectType,
  queryType,
  stringArg,
} from 'nexus';

import { Context } from './context';
import {
  createMockEndpoint,
  getMockEndpointById,
  getMockEndpointsByUserId,
  removeMockEndpoint,
  updateMockEndpoint,
} from './service/mock-endpoint';
import { createUser, deleteUserById, getUserById } from './service/user';
import { MockEndpointInput, User as UserInterface } from './types';
import { encode } from './utils/jwt';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.boolean('isTemp');
    t.list.field('mockEndpoints', {
      type: MockEndpoint,
      resolve: ({ id: userId }, _, { db }: Context) => {
        return getMockEndpointsByUserId(db, userId);
      },
    });
  },
});

const MockEndpoint = objectType({
  name: 'MockEndpoint',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('userId');
    t.nonNull.string('endpointName');
    t.nonNull.field('httpMethod', { type: HttpMethod });
    t.nonNull.string('urlPath');
    t.nonNull.int('httpStatus');
    t.nonNull.string('responseContentType');
    t.nonNull.string('charset');
    t.nonNull.string('httpHeaders');
    t.nonNull.string('httpResponseBody');
    t.nonNull.int('timeout');
  },
});

const Query = queryType({
  definition(t) {
    t.field('getUser', {
      type: User,
      args: {
        data: arg({ type: UserGetInput }),
      },
      resolve: async (_, __, { db, req, res }: Context) => {
        const createTempUser = async () => {
          const user = await createUser(db, {
            id: undefined,
            isTemp: true,
          });

          return user;
        };

        const setAccessToken = (user: UserInterface) => {
          let accessToken;

          try {
            accessToken = encode(user);
          } catch (e) {
            throw e;
          }

          res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60, // 1 hour
          });
        };

        if (!req.user) {
          const newTempUser = await createTempUser();
          setAccessToken(newTempUser);

          return newTempUser;
        }

        try {
          return getUserById(db, req.user.id);
        } catch (e) {
          throw e;
        }
      },
    });

    t.field('getMockEndpoint', {
      type: MockEndpoint,
      args: {
        data: arg({ type: MockEndpointGetInput }),
      },
      resolve: (_, args, { db }: Context) => {
        // auth
        return getMockEndpointById(db, args.data!.id);
      },
    });
  },
});

const Mutation = mutationType({
  definition(t) {
    t.nonNull.field('signupUser', {
      type: User,
      args: {
        data: arg({ type: UserCreateInput }),
      },
      resolve: (_, { data }, { db }: Context) => {
        return createUser(db, data);
      },
    });

    t.nonNull.field('removeUser', {
      type: User,
      resolve: async (_, __, { db, req, res }: Context) => {
        const deletedUser = await deleteUserById(db, req.user!.id);
        res.clearCookie('accessToken');

        return deletedUser;
      },
    });

    t.nonNull.field('createMockEndpoint', {
      type: MockEndpoint,
      args: {
        data: nonNull(arg({ type: MockEndpointInput })),
        userId: nonNull(stringArg()),
      },
      resolve: (_, { userId, data }, { db }: Context) => {
        return createMockEndpoint(db, userId, data as MockEndpointInput);
      },
    });

    t.nonNull.field('updateMockEndpoint', {
      type: MockEndpoint,
      args: {
        data: nonNull(arg({ type: MockEndpointInput })),
        userId: nonNull(stringArg()),
      },
      resolve: (_, { userId, data }, { db }: Context) => {
        return updateMockEndpoint(db, userId, data as MockEndpointInput);
      },
    });

    t.nonNull.field('removeMockEndpoint', {
      type: MockEndpoint,
      args: {
        data: nonNull(intArg()),
      },
      resolve: (_, { data }, { db }: Context) => {
        return removeMockEndpoint(db, data);
      },
    });
  },
});

const HttpMethod = enumType({
  name: 'HttpMethod',
  members: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

const UserGetInput = inputObjectType({
  name: 'UserGetInput',
  definition(t) {
    t.nonNull.string('id');
  },
});

const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.string('id');
    t.boolean('isTemp');
  },
});

const MockEndpointInput = inputObjectType({
  name: 'MockEndpointInput',
  definition(t) {
    t.int('id');
    t.nonNull.string('endpointName');
    t.nonNull.field('httpMethod', { type: HttpMethod });
    t.nonNull.string('urlPath');
    t.nonNull.int('httpStatus');
    t.nonNull.string('responseContentType');
    t.nonNull.string('charset');
    t.nonNull.string('httpHeaders');
    t.nonNull.string('httpResponseBody');
    t.nonNull.int('timeout');
  },
});

const MockEndpointGetInput = inputObjectType({
  name: 'MockEndpointGetInput',
  definition(t) {
    t.nonNull.int('id');
  },
});

export const schema = makeSchema({
  types: [
    DateTime,
    User,
    MockEndpoint,
    Query,
    Mutation,
    UserGetInput,
    UserCreateInput,
    MockEndpointInput,
    MockEndpointGetInput,
    HttpMethod,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
});
