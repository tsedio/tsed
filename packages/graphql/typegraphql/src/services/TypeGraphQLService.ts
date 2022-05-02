import {ApolloServer, ApolloService} from "@tsed/apollo";
import {Type} from "@tsed/core";
import {Inject, Injectable, InjectorService, Provider} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {DataSource} from "apollo-datasource";
import {GraphQLSchema} from "graphql";
import * as TypeGraphql from "type-graphql";
import {buildSchema, BuildSchemaOptions} from "type-graphql";
import {ApolloServerBase} from "apollo-server-core";
import {PROVIDER_TYPE_DATASOURCE_SERVICE, PROVIDER_TYPE_RESOLVER_SERVICE} from "../constants/constants";
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
  async createServer(id: string, settings: TypeGraphQLSettings): Promise<any> {
    if (this.has(id)) {
      return this.get(id)!;
    }

    try {
      const {dataSources, resolvers: initialResolvers = [], buildSchemaOptions = {}, serverConfig = {}, ...serverOptions} = settings;

      this.configureTypeGraphQLDI();

      const resolvers: any = [...this.getResolvers(), ...(initialResolvers as any[])];
      const schema = await this.createSchema({
        container: this.injector,
        ...buildSchemaOptions,
        resolvers
      });

      return await this.apolloService.createServer(getKey(id), {
        ...serverOptions,
        ...serverConfig,
        resolvers,
        dataSources: this.createDataSources(dataSources, serverConfig.dataSources),
        schema
      });
    } catch (err) {
      /* istanbul ignore next */
      this.logger.error(err);
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
    return this.injector.getProviders(PROVIDER_TYPE_RESOLVER_SERVICE).map((provider) => provider.useClass);
  }

  protected getDataSources(): Record<string, DataSource> {
    const providers = this.injector.getProviders(PROVIDER_TYPE_DATASOURCE_SERVICE);

    return providers.reduce<Record<string, DataSource>>((map, provider) => {
      // set the first letter of the class lowercase to follow proper conventions during access
      // i.e. this.context.dataSources.userService
      const sourceName = `${provider.name[0].toLowerCase()}${provider.name.slice(1)}`;
      map[sourceName] = this.injector.invoke(provider.provide);

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

  protected configureTypeGraphQLDI() {
    // istanbul ignore next
    // @ts-ignore
    if (TypeGraphql.useContainer) {
      // support old version of type-graphql under @v0.17
      // @ts-ignore
      TypeGraphql.useContainer(this.injectorService);
    }
  }
}
