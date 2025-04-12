import type {useServer} from "graphql-ws/lib/use/ws";
import type {ServerOptions as WSServerOptions} from "ws";

type ServerOptions = Parameters<typeof useServer>[0];

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
