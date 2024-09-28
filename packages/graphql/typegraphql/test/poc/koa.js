import KoaRouter from "@koa/router";
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core";
import {ApolloServer, gql} from "apollo-server-koa";
import http from "http";
import Koa from "koa";

const app = new Koa();
const mainRouter = new KoaRouter();
const httpServer = http.createServer();

async function startApolloServer({typeDefs, resolvers}) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
  });

  await server.start();

  const router = new KoaRouter();
  const middlewares = server.getMiddleware({path: "/graphql", app: router});

  return {server, middlewares: middlewares};
}

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin"
  },
  {
    title: "City of Glass",
    author: "Paul Auster"
  }
];

const resolvers = {
  Query: {
    books: () => books
  }
};

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  # This "Book" type defines the queryable fields for every book in our data source.

  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

startApolloServer({
  typeDefs,
  app,
  resolvers
}).then(async ({middlewares, server}) => {
  app.use(middlewares);
  app.listen(3000);

  httpServer.on("request", app.callback());

  await new Promise((resolve) => httpServer.listen({port: 4000}, resolve));

  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
});
