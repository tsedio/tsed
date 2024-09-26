import "./interfaces/interfaces.js";

import type {AlterApolloSettings, ApolloSettingsWithID} from "@tsed/apollo";
import type {Type} from "@tsed/core";
import {isClass} from "@tsed/core";
import {Configuration, Inject, InjectorService, Module} from "@tsed/di";
import {buildSchema} from "type-graphql";

import {RESOLVERS_PROVIDERS} from "./constants/constants.js";
import {ContextMiddleware} from "./middlewares/ContextMiddleware.js";

/**
 * @ignore
 */
@Module()
export class TypeGraphQLModule implements AlterApolloSettings {
  @Inject(InjectorService)
  protected injector: InjectorService;

  @Configuration()
  protected configuration: Configuration;

  async $alterApolloSettings(settings: ApolloSettingsWithID): Promise<ApolloSettingsWithID> {
    const {resolvers: initialResolvers = [], buildSchemaOptions = {}, ...serverOptions} = settings;

    const resolvers: any = this.getResolvers(settings.id, [...(initialResolvers as any[]), ...(buildSchemaOptions.resolvers || [])]);

    serverOptions.schema = await buildSchema({
      container: this.injector as never,
      ...buildSchemaOptions,
      resolvers,
      globalMiddlewares: [ContextMiddleware, ...(buildSchemaOptions.globalMiddlewares || [])]
    });

    return serverOptions;
  }

  protected getResolvers(id: string, resolvers: Type<any>[]): Type<any>[] {
    const globalResolvers = this.injector
      .getProviders(RESOLVERS_PROVIDERS)
      .filter((provider) => {
        const opts = provider.store.get("graphql");

        return !opts?.id || opts?.id === id;
      })
      .map((provider) => {
        return provider.useClass;
      });

    return resolvers
      .map((resolver) => {
        if (!(this.injector.has(resolver) || !isClass(resolver))) {
          this.injector
            .addProvider(resolver, {
              useClass: resolver
            })
            .invoke(resolver);
        }

        return resolver;
      })
      .concat(globalResolvers);
  }
}
