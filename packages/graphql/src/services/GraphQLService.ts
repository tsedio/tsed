import {Constant, HttpServer, InjectorService, PlatformApplication, Provider, Service} from "@tsed/common";
import {Type} from "@tsed/core";
import {DataSource} from "apollo-datasource";
import {ApolloServerBase} from "apollo-server-core";
import {GraphQLSchema} from "graphql";
import * as TypeGraphql from "type-graphql";
import {buildSchema, BuildSchemaOptions} from "type-graphql";
import {GraphQLServer} from "../interfaces/GraphQLServer";
import {GraphQLSettings} from "../interfaces/GraphQLSettings";
import {PROVIDER_TYPE_DATASOURCE_SERVICE} from "../registries/DataSourceServiceRegistry";
import {PROVIDER_TYPE_RESOLVER_SERVICE} from "../registries/ResolverServiceRegistry";

@Service()
export class GraphQLService {
  @Constant("httpPort")
  httpPort: string | number;

  @Constant("PLATFORM_NAME")
  platformName: string;

  /**
   *
   * @type {Map<any, any>}
   * @private
   */
  private _servers: Map<string, GraphQLServer> = new Map();

  constructor(private app: PlatformApplication, @HttpServer private httpServer: HttpServer, private injectorService: InjectorService) {}

  /**
   *
   * @returns {Promise<ApolloServer>}
   */
  async createServer(id: string, settings: GraphQLSettings): Promise<any> {
    const {
      path,
      installSubscriptionHandlers,
      dataSources,
      serverConfig = {},
      serverRegistration = {},
      buildSchemaOptions = {} as any
    } = settings;

    if (this.has(id)) {
      return await this.get(id)!;
    }

    this.injectorService.logger.info(`Create server with apollo-server-express for: ${id}`);
    this.injectorService.logger.debug(`options: ${JSON.stringify({path})}`);

    try {
      // istanbul ignore next
      // @ts-ignore
      if (TypeGraphql.useContainer) {
        // support old version of type-graphql under @v0.17
        // @ts-ignore
        TypeGraphql.useContainer(this.injectorService);
      }

      const resolvers = [...this.getResolvers(), ...(settings.resolvers || []), ...(buildSchemaOptions.resolvers || [])];

      const schema = await this.createSchema({
        container: this.injectorService,
        ...buildSchemaOptions,
        resolvers
      });

      const defaultServerConfig = {
        ...serverConfig,
        dataSources: this.createDataSources(dataSources, serverConfig.dataSources),
        schema
      };

      const server = this.createInstance(defaultServerConfig, settings);

      if (server) {
        server.applyMiddleware({path, ...serverRegistration, app: this.app.raw});
        if (installSubscriptionHandlers && this.httpPort) {
          server.installSubscriptionHandlers(this.httpServer);
        }

        this._servers.set(id || "default", {
          instance: server,
          schema
        });

        return server;
      }
    } catch (err) {
      /* istanbul ignore next */
      this.injectorService.logger.error(err);
      /* istanbul ignore next */
      process.exit(-1);
    }
  }

  /**
   * Create a new type-graphql Schema and bind it with Ts.ED injector.
   * @param buildSchemaOptions
   */
  async createSchema(buildSchemaOptions: BuildSchemaOptions) {
    return buildSchema(buildSchemaOptions);
  }

  /**
   * Get an instance of ApolloServer from his id
   * @returns ApolloServer
   */
  get(id: string = "default"): ApolloServerBase | undefined {
    return this._servers.get(id)!.instance;
  }

  /**
   * Get an instance of GraphQL schema from his id
   * @returns GraphQLSchema
   */
  getSchema(id: string = "default"): GraphQLSchema | undefined {
    return this._servers.get(id)!.schema;
  }

  /**
   *
   * @param {string} id
   * @returns {boolean}
   */
  has(id: string = "default"): boolean {
    return this._servers.has(id);
  }

  /**
   *
   * @returns {Provider<any>[]}
   */
  protected getResolvers(): Type<any>[] {
    return this.injectorService.getProviders(PROVIDER_TYPE_RESOLVER_SERVICE).map((provider) => provider.useClass);
  }

  protected getDataSources(): {[serviceName: string]: DataSource} {
    const providers = Array.from(this.injectorService.getProviders(PROVIDER_TYPE_DATASOURCE_SERVICE));

    return providers.reduce<{[serviceName: string]: DataSource}>((map, provider) => {
      // set the first letter of the class lowercase to follow proper conventions during access
      // i.e. this.context.dataSources.userService
      const sourceName = `${provider.name[0].toLowerCase()}${provider.name.substr(1)}`;
      map[sourceName] = this.injectorService.invoke(provider.provide);

      return map;
    }, {});
  }

  /**
   * create a new dataSources function to use with apollo server config
   * @param dataSources
   * @param serverConfigSources
   */
  protected createDataSources(dataSources: Function | undefined, serverConfigSources: Function | undefined) {
    return () => {
      const sources = this.getDataSources();

      return {
        ...sources,
        ...(dataSources ? dataSources() : {}),
        ...(serverConfigSources ? serverConfigSources() : {})
      };
    };
  }

  protected createInstance(
    defaultServerConfig: any,
    settings: GraphQLSettings
  ): (ApolloServerBase & {applyMiddleware(settings: any): any}) | undefined {
    const {server: customServer} = settings;

    // istanbul ignore next
    if (customServer) {
      return customServer(defaultServerConfig);
    }

    // istanbul ignore next
    try {
      const Server = require(`apollo-server-${this.platformName || "express"}`).ApolloServer;

      return new Server(defaultServerConfig);
    } catch (er) {
      this.injectorService.logger.error(`Platform "${this.platformName}" not supported by @tsed/graphql`);
    }

    // istanbul ignore next
    if (!this.platformName) {
      this.injectorService.logger.error(`Platform "${this.platformName}" not supported by @tsed/graphql`);
    }
  }
}
