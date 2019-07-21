import {Constant, ExpressApplication, HttpServer, InjectorService, Provider, Service} from "@tsed/common";
import {Type} from "@tsed/core";
import {DataSource} from "apollo-datasource";
import {ApolloServer} from "apollo-server-express";
import {GraphQLSchema} from "graphql";
import {$log} from "ts-log-debug";
import * as typeGraphql from "type-graphql";
import {buildSchema, BuildSchemaOptions} from "type-graphql";
import {IGraphQLServer} from "../interfaces/IGraphQLServer";
import {IGraphQLSettings} from "../interfaces/IGraphQLSettings";
import {PROVIDER_TYPE_DATASOURCE_SERVICE} from "../registries/DataSourceServiceRegistry";
import {PROVIDER_TYPE_RESOLVER_SERVICE} from "../registries/ResolverServiceRegistry";

@Service()
export class GraphQLService {
  @Constant("httpPort")
  httpPort: string | number;
  /**
   *
   * @type {Map<any, any>}
   * @private
   */
  private _servers: Map<string, IGraphQLServer> = new Map();

  constructor(
    @ExpressApplication private expressApp: ExpressApplication,
    @HttpServer private httpServer: HttpServer,
    private injectorService: InjectorService
  ) {}

  /**
   *
   * @returns {Promise<ApolloServer>}
   */
  async createServer(id: string, settings: IGraphQLSettings): Promise<any> {
    const {
      path,
      server: customServer,
      installSubscriptionHandlers,
      resolvers = [],
      dataSources,
      serverConfig = {},
      serverRegistration = {},
      buildSchemaOptions = {} as any
    } = settings;

    if (this.has(id)) {
      return await this.get(id)!;
    }

    $log.info(`Create server with apollo-server-express for: ${id}`);
    $log.debug(`options: ${JSON.stringify({path})}`);

    try {
      // istanbul ignore next
      // @ts-ignore
      if (typeGraphql.useContainer) {
        // support old version of type-graphql under @v0.17
        // @ts-ignore
        typeGraphql.useContainer(this.injectorService);
      }

      const schema = await this.createSchema({
        container: this.injectorService,
        ...buildSchemaOptions,
        resolvers: [...this.getResolvers(), ...resolvers, ...(buildSchemaOptions.resolvers || [])]
      });

      const defaultServerConfig = {
        ...serverConfig,
        dataSources: this.createDataSources(dataSources, serverConfig.dataSources),
        schema
      };

      const server = customServer ? customServer(defaultServerConfig) : new ApolloServer(defaultServerConfig);

      // @ts-ignore
      server.applyMiddleware({path, ...serverRegistration, app: this.expressApp});

      if (installSubscriptionHandlers && this.httpPort) {
        server.installSubscriptionHandlers(this.httpServer);
      }

      this._servers.set(id || "default", {
        instance: server,
        schema
      });

      return server;
    } catch (err) {
      /* istanbul ignore next */
      $log.error(err);
      /* istanbul ignore next */
      process.exit();
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
  get(id: string = "default"): ApolloServer | undefined {
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
    return Array.from(this.injectorService.getProviders(PROVIDER_TYPE_RESOLVER_SERVICE)).map(provider =>
      this.injectorService.invoke(provider.provide)
    );
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
    const sources = this.getDataSources();

    return () => {
      return {
        ...sources,
        ...(dataSources ? dataSources() : {}),
        ...(serverConfigSources ? serverConfigSources() : {})
      };
    };
  }
}
