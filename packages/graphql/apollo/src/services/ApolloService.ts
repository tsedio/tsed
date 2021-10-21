import {Constant, HttpServer, HttpsServer, Inject, Logger, PlatformApplication, Service} from "@tsed/common";
import type {Config} from "apollo-server-core";
import type {GraphQLSchema} from "graphql";
import type {ApolloServer, ApolloSettings} from "../interfaces/ApolloSettings";

@Service()
export class ApolloService {
  @Constant("PLATFORM_NAME")
  platformName: string;

  @Constant("httpPort")
  private httpPort: string | number;

  @Constant("httpsPort")
  private httpsPort: string | number;

  @Inject()
  private app: PlatformApplication;

  @Inject(HttpServer)
  private httpServer: HttpServer;

  @Inject(HttpsServer)
  private httpsServer: HttpsServer;

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
      instance: ApolloServer;
      schema: GraphQLSchema | undefined;
    }
  > = new Map();

  async createServer(id: string, settings: ApolloSettings): Promise<any> {
    if (this.has(id)) {
      return this.get(id)!;
    }

    try {
      const {path, installSubscriptionHandlers, serverRegistration = {}, server: customServer, ...serverSettings} = settings;

      this.logger.info(`Create server with Apollo for: ${id}`);
      this.logger.debug(`options: ${JSON.stringify({path})}`);

      const server = this.createInstance(serverSettings, customServer);

      if (server) {
        this.servers.set(id || "default", {
          instance: server,
          schema: settings.schema
        });

        return this.bindServer(server, settings);
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
  get(id: string = "default"): ApolloServer | undefined {
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

  protected async bindServer(server: ApolloServer, options: ApolloSettings) {
    await server.applyMiddleware({path: options.path, ...options.serverRegistration, app: this.app.raw});

    if (options.installSubscriptionHandlers && (this.httpPort || this.httpsPort)) {
      this.httpPort && server.installSubscriptionHandlers(this.httpServer);
      this.httpPort && server.installSubscriptionHandlers(this.httpsServer);
    }

    return server;
  }

  protected createInstance(options: Config, server?: (config: Config) => ApolloServer): ApolloServer | undefined {
    // istanbul ignore next
    if (server) {
      return server(options);
    }

    // istanbul ignore next
    try {
      const Server = require(`apollo-server-${this.platformName || "express"}`).ApolloServer;

      return new Server(options);
    } catch (er) {
      this.logger.error(`Platform "${this.platformName}" not supported by @tsed/apollo`);
    }
  }
}
