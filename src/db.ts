import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

prisma.$on('query', (e) => {
  const shouldLog =
    process.env.NODE_ENV === 'production' ? e.duration > 3000 : e.duration > -1;

  if (shouldLog) {
    console.log('Query: ' + e.query);
    console.log('Duration: ' + e.duration + 'ms');
  }
});

export default prisma;
