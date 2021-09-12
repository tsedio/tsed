import {TypeGraphQLSettings} from "./TypeGraphQLSettings";

declare global {
  namespace TsED {
    interface Configuration {
      graphql: {[key: string]: TypeGraphQLSettings};
      typegraphql: {[key: string]: TypeGraphQLSettings};
    }
  }
}

export * from "./TypeGraphQLSettings";
