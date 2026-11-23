import "@tsed/apollo";

import {EventEmitter} from "node:events";
import Http from "node:http";
import Https from "node:https";

import {makeExecutableSchema} from "@graphql-tools/schema";
import {GraphQLWSModule} from "@tsed/graphql-ws";
import {PlatformTest} from "@tsed/platform-http/testing";
import {createClient} from "graphql-ws";

import {PlatformFulmine} from "../src/components/PlatformFulmine.js";

class Server {}

const schema = makeExecutableSchema({
  typeDefs: "type Query { hello: String } type Subscription { count(to: Int!): Int }",
  resolvers: {
    Query: {hello: () => "world"},
    Subscription: {
      count: {
        subscribe: async function* (_: unknown, {to}: {to: number}) {
          for (let i = 1; i <= to; i++) yield {count: i};
        }
      }
    }
  }
});

// The upgrade is answered by uWebSockets.js and never reaches Node.js, so @tsed/graphql-ws serves the
// subscriptions on the uWebSockets.js app.
describe("@tsed/graphql-ws on PlatformFulmine", () => {
  afterEach(() => PlatformTest.reset());

  it("should stream a subscription over uWebSockets.js", async () => {
    const platform = await PlatformFulmine.bootstrap(Server, {
      httpPort: "127.0.0.1:0",
      httpsPort: false,
      logger: {level: "off"},
      apollo: {
        default: {path: "/graphql", schema}
      }
    } as any);
    await platform.listen();

    const client = createClient({url: `ws://${platform.settings.get("httpPort")}/graphql`, retryAttempts: 0});
    const values: unknown[] = [];

    await new Promise<void>((resolve, reject) => {
      client.subscribe({query: "subscription { count(to: 3) }"}, {next: (value) => values.push(value), error: reject, complete: resolve});
    });
    await client.dispose();

    expect(values).toEqual([{data: {count: 1}}, {data: {count: 2}}, {data: {count: 3}}]);

    await platform.stop();
  });

  it("should refuse verifyClient, which uWebSockets.js cannot run", async () => {
    const start = async () => {
      const platform = await PlatformFulmine.bootstrap(Server, {
        httpPort: "127.0.0.1:0",
        httpsPort: false,
        logger: {level: "off"},
        apollo: {
          default: {path: "/graphql", schema, wsServerOptions: {verifyClient: () => true}}
        }
      } as any);
      await platform.listen();
    };

    await expect(start()).rejects.toThrow("wsServerOptions.verifyClient is not supported on the uWebSockets.js app");
  });

  it("should keep the standalone WebSocket server when no HTTP server listens", async () => {
    const platform = await PlatformFulmine.bootstrap(Server, {
      httpPort: false,
      httpsPort: false,
      logger: {level: "off"},
      apollo: {
        default: {path: "/graphql", schema, wsServerOptions: {port: 0}}
      }
    } as any);
    await platform.listen();
    await platform.stop();
  });

  it("should not read uwsApp on Bun, where fulmine.js serves through node:http", async () => {
    Object.defineProperty(process.versions, "bun", {value: "1.3.0", configurable: true});
    // the app on Bun: uwsApp is there, but reading it throws because uWebSockets.js does not load
    const server = Object.defineProperty(new EventEmitter(), "uwsApp", {
      get() {
        throw new Error("uWebSockets.js does not load on Bun");
      }
    });

    try {
      await PlatformTest.create();
      const module = await PlatformTest.invoke<GraphQLWSModule>(GraphQLWSModule, [
        {token: Http.Server, use: server},
        {token: Https.Server, use: null}
      ]);
      const wsServer = await module.createWSServer({path: "/graphql", schema});

      await wsServer.dispose();
    } finally {
      delete (process.versions as any).bun;
    }
  });
});
