import {Module, constant, inject, logger} from "@tsed/di";
import {GraphQLWSOptions} from "./GraphQLWSOptions.js";
import Http from "node:http";
import Https from "node:https";
import {WebSocketServer} from "ws";
import {useServer} from "graphql-ws/use/ws";

@Module()
export class GraphQLWSModule {
  private settings = constant<GraphQLWSOptions>("graphqlWs", {} as GraphQLWSOptions);
  private httpServer = inject<Http.Server | null>(Http.Server);
  private httpsServer = inject<Https.Server | null>(Https.Server);

  async createWSServer(settings: GraphQLWSOptions) {
    const server = this.httpsServer || this.httpServer!;

    if ("uwsApp" in server) {
      return this.createUWSServer(server.uwsApp as any, settings);
    }

    const opts = {
      ...(this.settings.wsServerOptions || {}),
      ...settings.wsServerOptions,
      server,
      path: settings.path
    };

    const wsServer = new WebSocketServer(opts);

    return useServer(
      {
        ...(this.settings.wsUseServerOptions || {}),
        ...settings.wsUseServerOptions,
        schema: settings.schema
      },
      wsServer
    );
  }

  /**
   * A server on uWebSockets.js, as with PlatformFulmine, has no Node.js socket to take the upgrade from: the
   * subscriptions are served by its uWebSockets.js app, with the behavior graphql-ws provides for it.
   */
  protected async createUWSServer(uwsApp: any, settings: GraphQLWSOptions) {
    const {makeBehavior} = await import("graphql-ws/use/uWebSockets");
    const behavior = makeBehavior({
      ...(this.settings.wsUseServerOptions || {}),
      ...settings.wsUseServerOptions,
      schema: settings.schema
    });

    uwsApp.ws(settings.path, behavior);

    // the open sockets close with the uWebSockets.js app, when the server stops
    return {async dispose() {}};
  }

  async $alterApolloServerPlugins(plugins: any[], settings: GraphQLWSOptions) {
    const wsServer = await this.createWSServer(settings);

    logger().info(`Create GraphQL WS server on: ${settings.path}`);

    return plugins.concat({
      serverWillStart() {
        return {
          async drainServer() {
            await wsServer.dispose();
          }
        };
      }
    } as any);
  }
}
