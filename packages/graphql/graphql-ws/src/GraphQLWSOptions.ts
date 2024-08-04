// @ts-ignore
import {ServerOptions} from "graphql-ws/lib/server";
import {ServerOptions as WSServerOptions} from "ws";

export interface GraphQLWSOptions {
  path: string;
  schema: any;
  wsUseServerOptions?: ServerOptions;
  wsServerOptions?: WSServerOptions;
}

declare global {
  namespace TsED {
    interface ApolloSettings {
      wsUseServerOptions?: ServerOptions;
      wsServerOptions?: WSServerOptions;
    }
  }
}
