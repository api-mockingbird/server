import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import depthLimit from 'graphql-depth-limit';
import http from 'http';
import createError, { HttpError } from 'http-errors';
import cron from 'node-cron';
import shell from 'shelljs';

import app from './app';
import { createContext } from './context';
import { schema } from './schema';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

startServer();

async function startServer() {
  const port = normalizePort(process.env.PORT || '4000');
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context: createContext,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    validationRules: [depthLimit(2)],
  });
  const graphqlCorsWhitelist = [process.env.CLIENT_BASE_URL!];

  if (process.env.NODE_ENV === 'development') {
    graphqlCorsWhitelist.push('https://studio.apollographql.com');
  }

  await server.start();

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: graphqlCorsWhitelist,
      credentials: true,
    },
  });

  app.use(cors({ origin: '*' }));

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);

    res.send(err);
  });

  cron.schedule('0 4 * * *', () => {
    try {
      shell.exec('node utils/removeOldTempUsers.js');
      console.log('removed temp users older than one day.');
    } catch (error) {
      console.error(error);
    }
  });

  await httpServer.listen(port);

  console.log(`server listening on port ${port}..`);
}

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}
