import {InjectorService, PlatformApplication} from "@tsed/common";
import {classOf, nameOf, Store} from "@tsed/core";
import {Constant, Inject, Service} from "@tsed/di";
import {Logger} from "@tsed/logger";
import type {Config} from "apollo-server-core";
import {
  ApolloServerBase,
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageLocalDefault
} from "apollo-server-core";
import {PluginDefinition} from "apollo-server-core/src/types";
import type {GraphQLSchema} from "graphql";
import Http from "http";
import Https from "https";
import {DATASOURCES_PROVIDERS} from "../constants/constants";
import type {ApolloServer, ApolloSettings} from "../interfaces/ApolloSettings";
import {ApolloCustomServerCB} from "../interfaces/ApolloSettings";

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
  private app: PlatformApplication<any>;

  @Inject(Http.Server)
  private httpServer: Http.Server | null;

  @Inject(Https.Server)
  private httpsServer: Https.Server | null;

  @Inject()
  private injector: InjectorService;

  constructor(@Inject(DATASOURCES_PROVIDERS) protected dataSources: any[]) {}

  async createServer(id: string, settings: ApolloSettings): Promise<ApolloServer> {
    if (!this.has(id)) {
      try {
        const {dataSources, path, middlewareOptions = {}, server: customServer, ...config} = settings;

        this.logger.info(`Create server with Apollo for: ${id}`);
        this.logger.debug(`options: ${JSON.stringify({path})}`);

        const plugins = await this.getPlugins(settings);

        const server = await this.createInstance(
          {
            ...config,
            plugins,
            dataSources: this.createDataSources(dataSources)
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

          this.app.use(middleware);
        }
      } catch (er) {
        this.logger.error({
          event: "APOLLO_BOOTSTRAP_ERROR",
          error_name: er.name,
          message: er.message,
          stack: er.stack
        });
        /* istanbul ignore next */
        process.exit(-1);
      }
    }

    return this.get(id) as ApolloServer;
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
    if (server) {
      return server(options);
    }

    const importServer = async () => {
      switch (this.platformName) {
        default:
          this.logger.error(`Platform "${this.platformName}" not supported by @tsed/apollo`);
        case "express":
          return (await import("apollo-server-express")).ApolloServer;
        case "koa":
          return (await import("apollo-server-koa")).ApolloServer;
      }
    };

    const Server = await importServer();

    return new Server(options);
  }

  /**
   * create a new dataSources function to use with apollo server config
   * @param dataSources
   */
  protected createDataSources(dataSources: Function | undefined) {
    const dataSourcesHash = this.dataSources.reduce((map, instance) => {
      const klass = classOf(instance);
      const store = Store.from(klass);
      let {name} = store.get(DATASOURCES_PROVIDERS);

      name = name || nameOf(klass);

      const sourceName = `${name[0].toLowerCase()}${name.slice(1)}`;
      map[sourceName] = instance;

      return map;
    }, {});

    return () => {
      return {
        ...dataSourcesHash,
        ...(dataSources ? dataSources() : {})
      };
    };
  }

  private async getPlugins(serverSettings: ApolloSettings): Promise<PluginDefinition[]> {
    const playground = serverSettings.playground || (serverSettings.playground === undefined && process.env.NODE_ENV !== "production");

    const result = await this.injector.alter(
      "$alterApolloServerPlugins",
      [
        this.httpServer &&
          ApolloServerPluginDrainHttpServer({
            httpServer: this.httpServer
          }),
        this.httpsServer &&
          ApolloServerPluginDrainHttpServer({
            httpServer: this.httpsServer
          }),
        ...(serverSettings.plugins || [])
      ].filter(Boolean),
      serverSettings
    );

    return result
      .concat([playground ? ApolloServerPluginLandingPageLocalDefault({embed: true}) : ApolloServerPluginLandingPageDisabled()])
      .filter(Boolean);
  }
}
