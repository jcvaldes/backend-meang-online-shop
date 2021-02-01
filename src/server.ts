import compression from 'compression';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import environment from './config/environments';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import { IContext } from './interfaces/context.interface';
// Configuracion de las variables de entorno (lectura)
if (process.env.NODE_ENV !== 'production') {
  const env = environment;
}

async function init() {
  const app = express();
  app.use(cors());
  app.use(compression());
  const database = new Database();
  const db  = await database.init();
  // const context = {db};
  const context = async({req, connection}: IContext) => {
    const token = (req) ? req.headers.authorization : connection.authorization;
    return {db, token};
  }
  const server = new ApolloServer({
    schema,
    introspection: true, // visualizo info dentro del playground
    context
  });
  server.applyMiddleware({app});

  // app.get('/', (_, res) => {
  //   res.send('API MEANG - Online Shop Start');
  // });
  app.get('/', expressPlayground({
    endpoint: '/graphql'
  }));

  const httpServer = createServer(app);
  const PORT = process.env.PORT || 3000;
  httpServer.listen({
    port: PORT
  }, () => console.log(`http://localhost:${PORT} API MEANG - Online Shop Start`));
}

init();