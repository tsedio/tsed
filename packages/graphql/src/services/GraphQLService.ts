import {Constant, ExpressApplication, HttpServer, InjectorService, Provider, Service} from "@tsed/common";
import {Type} from "@tsed/core";
import {ApolloServer} from "apollo-server-express";
import {GraphQLSchema} from "graphql";
import {$log} from "ts-log-debug";
import {buildSchema, BuildSchemaOptions, useContainer} from "type-graphql";
import {IGraphQLServer} from "../interfaces/IGraphQLServer";
import {IGraphQLSettings} from "../interfaces/IGraphQLSettings";
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
   * @returns {Promise<"mongoose".Connection>}
   */
  async createServer(id: string, settings: IGraphQLSettings): Promise<any> {
    const {
      path,
      server: customServer,
      installSubscriptionHandlers,
      resolvers = [],
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
      const schema = await this.createSchema({
        ...buildSchemaOptions,
        resolvers: [...this.getResolvers(), ...resolvers, ...(buildSchemaOptions.resolvers || [])]
      });

      const defaultServerConfig = {
        ...serverConfig,
        schema
      };

      const server = customServer ? customServer(defaultServerConfig) : new ApolloServer(defaultServerConfig);

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
    useContainer(this.injectorService);

    return buildSchema(buildSchemaOptions);
  }

  /**
   * Get an instance of ApolloServer from his id
   * @returns {"mongoose".Connection}
   */
  get(id: string = "default"): ApolloServer | undefined {
    return this._servers.get(id)!.instance;
  }

  /**
   * Get an instance of GraphQL schema from his id
   * @returns {"mongoose".Connection}
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
    return Array.from(this.injectorService.getProviders(PROVIDER_TYPE_RESOLVER_SERVICE)).map(provider => provider.instance);
  }
}
