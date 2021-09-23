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

export const DateTime = asNexusMethod(DateTimeResolver, 'date');

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.boolean('isTemp');
    t.list.field('mockEndpoints', {
      type: MockEndpoint,
      resolve: ({ id }, _, { prisma }: Context) => {
        return prisma.user
          .findUnique({
            where: { id },
          })
          .mockEndpoints();
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
    t.field('getUserWithMockEndpoints', {
      type: User,
      args: {
        data: nonNull(arg({ type: UserGetInput })),
      },
      resolve: (_, { data }, { prisma }: Context) => {
        return prisma.user.findUnique({
          where: { id: data.id },
        });
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
      resolve: (_, { data }, { prisma }: Context) => {
        return prisma.user.create({
          data: {
            id: data?.id ?? undefined,
            isTemp: data?.isTemp ?? undefined,
          },
        });
      },
    });

    t.nonNull.field('createMockInput', {
      type: MockEndpoint,
      args: {
        data: nonNull(arg({ type: MockEndpointCreateInput })),
        userId: nonNull(stringArg()),
      },
      resolve: (_, { userId, data }, { prisma }: Context) => {
        return prisma.mockEndpoint.create({
          data: {
            userId,
            ...data,
          },
        });
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
