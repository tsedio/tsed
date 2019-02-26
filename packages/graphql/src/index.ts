import "@tsed/common";
import {IGraphQLSettings} from "./interfaces/IGraphQLSettings";

declare module "@tsed/common" {
  interface IServerSettingsOptions {
    graphql: {[key: string]: IGraphQLSettings};
  }
}

export * from "./interfaces/IGraphQLSettings";
export * from "./decorators/resolverService";
export * from "./services/GraphQLService";
export * from "./registries/ResolverServiceRegistry";
export * from "./GraphQLModule";
