import {Constant, Inject, Service} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {PlatformApplication} from "@tsed/common";
import type {Config} from "apollo-server-core";
import {
  ApolloServerBase,
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import type {GraphQLSchema} from "graphql";
import type {ApolloServer, ApolloSettings} from "../interfaces/ApolloSettings";
import {ApolloCustomServerCB} from "../interfaces/ApolloSettings";
import Http from "http";
import Https from "https";

@Service()
export class ApolloService {
  @Constant("PLATFORM_NAME")
  platformName: string;

  @Inject()
  protected logger: Logger;

  /**
   *
   * @type {Map<any, any>}
   * @private
   */
  protected servers: Map<
    string,
    {
      instance: ApolloServerBase;
      schema: GraphQLSchema | undefined;
    }
  > = new Map();

  @Inject()
  private app: PlatformApplication<any, any>;

  @Inject(Http.Server)
  private httpServer: Http.Server | null;

  @Inject(Https.Server)
  private httpsServer: Https.Server | null;

  async createServer(id: string, settings: ApolloSettings): Promise<any> {
    if (this.has(id)) {
      return this.get(id)!;
    }

    try {
      const {path, middlewareOptions = {}, server: customServer, ...config} = settings;

      this.logger.info(`Create server with Apollo for: ${id}`);
      this.logger.debug(`options: ${JSON.stringify({path})}`);

      const server = await this.createInstance(
        {
          ...config,
          plugins: this.getPlugins(settings)
        },
        customServer
      );

      if (server) {
        this.servers.set(id || "default", {
          instance: server,
          schema: settings.schema
        });

        await server.start();

        const middleware = server.getMiddleware({
          path: settings.path,
          ...middlewareOptions
        });

        this.app.getRouter().use(middleware);

        return server;
      }
    } catch (err) {
      /* istanbul ignore next */
      this.logger.error(err);
      /* istanbul ignore next */
      process.exit(-1);
    }
  }

  /**
   * Get an instance of ApolloServer from his id
   * @returns ApolloServer
   */
  get(id: string = "default"): ApolloServerBase | undefined {
    return this.servers.get(id)?.instance;
  }

  /**
   * Get an instance of GraphQL schema from his id
   * @returns GraphQLSchema
   */
  getSchema(id: string = "default"): GraphQLSchema | undefined {
    return this.servers.get(id)?.schema;
  }

  /**
   *
   * @param {string} id
   * @returns {boolean}
   */
  has(id: string = "default"): boolean {
    return this.servers.has(id);
  }

  protected async createInstance(options: Config, server?: ApolloCustomServerCB): Promise<ApolloServer | undefined> {
    // istanbul ignore next
    if (server) {
      return server(options);
    }

    // istanbul ignore next
    try {
      const {ApolloServer: Server} = await import(`apollo-server-${this.platformName || "express"}`);

      return new Server(options);
    } catch (er) {
      this.logger.error(`Platform "${this.platformName}" not supported by @tsed/apollo`);
    }
  }

  private getPlugins(serverSettings: ApolloSettings): any[] {
    const playground = serverSettings.playground || (serverSettings.playground === undefined && process.env.NODE_ENV !== "production");

    return [
      playground ? ApolloServerPluginLandingPageGraphQLPlayground() : ApolloServerPluginLandingPageDisabled(),
      this.httpServer &&
        ApolloServerPluginDrainHttpServer({
          httpServer: this.httpServer
        }),
      this.httpsServer &&
        ApolloServerPluginDrainHttpServer({
          httpServer: this.httpsServer
        }),
      ...(serverSettings.plugins || [])
    ].filter(Boolean);
  }
}
