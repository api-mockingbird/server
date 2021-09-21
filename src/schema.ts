import { DateTimeResolver } from 'graphql-scalars';
import { makeSchema, asNexusMethod } from 'nexus';

import { Context } from './context';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');

export const schema = makeSchema({
  types: [DateTime],
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
