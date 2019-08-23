import {IGraphQLSettings} from "./IGraphQLSettings";

declare global {
  namespace TsED {
    interface Configuration {
      graphql: {[key: string]: IGraphQLSettings};
    }
  }
}

export * from "./IGraphQLServer";
export * from "./IGraphQLSettings";
