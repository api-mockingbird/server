import { DateTimeResolver } from 'graphql-scalars';
import {
  arg,
  asNexusMethod,
  inputObjectType,
  makeSchema,
  mutationType,
  nonNull,
  objectType,
  queryType,
  stringArg,
} from 'nexus';

import { Context } from './context';
import { NexusGenObjects } from './generated/nexus';
import {
  createMockEndpoint,
  getMockEndpointsByUserId,
} from './service/mock-endpoint';
import { createUser, deleteUserById, getUserById } from './service/user';
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
    t.nonNull.string('responseName');
    t.nonNull.string('httpMethod');
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

        const setAccessToken = (user: NexusGenObjects['User']) => {
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

    t.nonNull.field('createMockInput', {
      type: MockEndpoint,
      args: {
        data: nonNull(arg({ type: MockEndpointCreateInput })),
        userId: nonNull(stringArg()),
      },
      resolve: (_, { userId, data }, { db }: Context) => {
        return createMockEndpoint(db, userId, data);
      },
    });
  },
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

const MockEndpointCreateInput = inputObjectType({
  name: 'MockEndpointCreateInput',
  definition(t) {
    t.nonNull.string('responseName');
    t.nonNull.string('httpMethod');
    t.nonNull.string('urlPath');
    t.nonNull.int('httpStatus');
    t.nonNull.string('responseContentType');
    t.nonNull.string('charset');
    t.nonNull.string('httpHeaders');
    t.nonNull.string('httpResponseBody');
    t.nonNull.int('timeout');
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
    MockEndpointCreateInput,
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
