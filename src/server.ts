import { NextFunction, Request, Response } from 'express';
import http from 'http';
import createError, { HttpError } from 'http-errors';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

import app from './app';
import { context } from './context';
import { schema } from './schema';

startApolloServer();

async function startApolloServer() {
  const port = normalizePort(process.env.PORT || '4000');
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: '/',
  });

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
  });

  httpServer.listen(port, () => {
    console.log(`server listening on port ${port}..`);
  });
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
