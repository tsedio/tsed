import {GraphQLSettings} from "./GraphQLSettings";

declare global {
  namespace TsED {
    interface Configuration {
      graphql: {[key: string]: GraphQLSettings};
    }
  }
}

export * from "./GraphQLServer";
export * from "./GraphQLSettings";
