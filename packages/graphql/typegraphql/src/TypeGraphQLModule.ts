import "./interfaces/interfaces.js";
import {AlterApolloSettings, ApolloSettingsWithID} from "@tsed/apollo";
import {injectable, injector} from "@tsed/di";
import {isClass, Type} from "@tsed/core";
import {ContextMiddleware} from "./middlewares/ContextMiddleware.js";
import {RESOLVERS_PROVIDERS} from "./constants/constants.js";
import {buildSchema} from "type-graphql";

/**
 * @ignore
 */
export class TypeGraphQLModule implements AlterApolloSettings {
  async $alterApolloSettings(settings: ApolloSettingsWithID): Promise<ApolloSettingsWithID> {
    const {resolvers: initialResolvers = [], buildSchemaOptions = {}, ...serverOptions} = settings;

    const resolvers: any = this.getResolvers(settings.id, [...(initialResolvers as any[]), ...(buildSchemaOptions.resolvers || [])]);

    serverOptions.schema = await buildSchema({
      container: injector() as never,
      ...buildSchemaOptions,
      resolvers,
      globalMiddlewares: [ContextMiddleware, ...(buildSchemaOptions.globalMiddlewares || [])]
    });

    return serverOptions;
  }

  protected getResolvers(id: string, resolvers: Type<any>[]): Type<any>[] {
    const globalResolvers = injector()
      .providers.getMany(RESOLVERS_PROVIDERS)
      .filter((provider) => {
        const opts = provider.store.get("graphql");

        return !opts?.id || opts?.id === id;
      })
      .map((provider) => {
        return provider.useClass;
      });

    return resolvers
      .map((resolver) => {
        if (!(injector().has(resolver) || !isClass(resolver))) {
          injector()
            .add(resolver, {
              useClass: resolver
            })
            .invoke(resolver);
        }

        return resolver;
      })
      .concat(globalResolvers);
  }
}

injectable(TypeGraphQLModule);
