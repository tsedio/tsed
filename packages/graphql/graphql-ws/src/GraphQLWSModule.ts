import {Constant, Inject, InjectorService, Module} from "@tsed/di";
import {useServer} from "graphql-ws/lib/use/ws";
import Http from "http";
import Https from "https";
import {WebSocketServer} from "ws";
import {GraphQLWSOptions} from "./GraphQLWSOptions";

@Module()
export class GraphQLWSModule {
  @Constant("graphqlWs", {})
  private settings: GraphQLWSOptions;

  @Inject(Http.Server)
  private httpServer: Http.Server | null;

  @Inject(Https.Server)
  private httpsServer: Https.Server | null;

  @Inject()
  private injector: InjectorService;

  createWSServer(settings: GraphQLWSOptions) {
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
