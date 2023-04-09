import {ApolloServer, ApolloService} from "@tsed/apollo";
import {Type} from "@tsed/core";
import {Inject, Injectable, InjectorService, Provider} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {ApolloServerBase} from "apollo-server-core";
import {GraphQLSchema} from "graphql";
import {buildSchema, BuildSchemaOptions} from "type-graphql";
import {RESOLVERS_PROVIDERS} from "../constants/constants";
import {TypeGraphQLSettings} from "../interfaces/interfaces";

const getKey = (id: string) => `typegraphql-${id}`;

@Injectable()
export class TypeGraphQLService {
  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected apolloService: ApolloService;

  @Inject()
  protected logger: Logger;

  /**
   * Get an instance of ApolloServer from his id
   * @returns ApolloServer
   */
  get(id: string = "default"): ApolloServerBase | undefined {
    return this.apolloService.get(getKey(id));
  }

  /**
   *
   * @param {string} id
   * @returns {boolean}
   */
  has(id: string = "default"): boolean {
    return this.apolloService.has(getKey(id));
  }

  /**
   *
   * @returns {Promise<ApolloServer>}
   */
  async createServer(id: string, settings: TypeGraphQLSettings) {
    if (!this.has(id)) {
      try {
        const {dataSources, resolvers: initialResolvers = [], buildSchemaOptions = {}, serverConfig = {}, ...serverOptions} = settings;

        const resolvers: any = [...this.getResolvers(), ...(initialResolvers as any[]), ...(buildSchemaOptions.resolvers || [])];
        const schema = await this.createSchema({
          container: this.injector,
          ...buildSchemaOptions,
          resolvers
        });

        return await this.apolloService.createServer(getKey(id), {
          ...serverOptions,
          ...serverConfig,
          resolvers,
          dataSources: () => {
            return {
              ...(dataSources ? dataSources() : {}),
              ...(serverConfig.dataSources ? serverConfig.dataSources() : {})
            };
          },
          schema
        });
      } catch (er) {
        /* istanbul ignore next */
        this.logger.error({
          event: "TYPEGRAPHQL_BOOTSTRAP_ERROR",
          error_name: er.name,
          message: er.message,
          stack: er.stack
        });
        /* istanbul ignore next */
        process.exit(-1);
      }
    }

    return this.get(id)!;
  }

  /**
   * Create a new type-graphql Schema and bind it with Ts.ED injector.
   * @param buildSchemaOptions
   */
  async createSchema(buildSchemaOptions: BuildSchemaOptions) {
    return buildSchema(buildSchemaOptions);
  }

  /**
   * Get an instance of GraphQL schema from his id
   * @returns GraphQLSchema
   */
  getSchema(id: string = "default"): GraphQLSchema | undefined {
    return this.apolloService.getSchema(getKey(id));
  }

  /**
   *
   * @returns {Provider<any>[]}
   */
  protected getResolvers(): Type<any>[] {
    return this.injector.getProviders(RESOLVERS_PROVIDERS).map((provider) => provider.useClass);
  }
}
