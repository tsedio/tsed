import "@tsed/apollo";
import "@tsed/graphql-ws";

import {makeExecutableSchema} from "@graphql-tools/schema";
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

    await new Promise((resolve, reject) => {
      client.subscribe({query: "subscription { count(to: 3) }"}, {next: (value) => values.push(value), error: reject, complete: resolve});
    });
    await client.dispose();

    expect(values).toEqual([{data: {count: 1}}, {data: {count: 2}}, {data: {count: 3}}]);

    await platform.stop();
  });
});
