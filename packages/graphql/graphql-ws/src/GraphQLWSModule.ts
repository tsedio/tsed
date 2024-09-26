import {Constant, Inject, InjectorService, Module} from "@tsed/di";
import {useServer} from "graphql-ws/lib/use/ws";
import Http from "http";
import Https from "https";

import type {GraphQLWSOptions} from "./GraphQLWSOptions.js";

@Module()
export class GraphQLWSModule {
  @Constant("graphqlWs", {})
  private settings: GraphQLWSOptions;

  @Inject(Http.Server)
  private httpServer: Http.Server | null;

  @Inject(Https.Server)
  private httpsServer: Https.Server | null;

  @Inject(InjectorService)
  private injector: InjectorService;

  async createWSServer(settings: GraphQLWSOptions): Promise<ReturnType<typeof useServer>> {
    // @ts-ignore
    const {WebSocketServer} = await import("ws");

    const wsServer = new WebSocketServer({
      ...(this.settings.wsServerOptions || {}),
      ...settings.wsServerOptions,
      server: this.httpsServer || this.httpServer!,
      path: settings.path
    });

    return useServer(
      {
        ...(this.settings.wsUseServerOptions || {}),
        ...settings.wsUseServerOptions,
        schema: settings.schema
      },
      wsServer
    );
  }

  async $alterApolloServerPlugins(plugins: any[], settings: GraphQLWSOptions) {
    const wsServer = await this.createWSServer(settings);

    this.injector.logger.info(`Create GraphQL WS server on: ${settings.path}`);

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
