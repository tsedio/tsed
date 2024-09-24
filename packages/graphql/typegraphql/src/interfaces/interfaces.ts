import type {ApolloSettings as AS} from "@tsed/apollo";
import {BuildSchemaOptions} from "type-graphql";

declare global {
  namespace TsED {
    interface ApolloSettings {
      buildSchemaOptions?: Partial<BuildSchemaOptions>;
    }

    interface Configuration {
      /**
       * @deprecated Use apollo instead
       */
      graphql: {[key: string]: AS};
      /**
       * @deprecated Use apollo instead
       */
      typegraphql: {[key: string]: AS};
    }
  }
}
