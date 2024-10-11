import type {PlatformContext} from "@tsed/platform-http";

import type {ApolloContext} from "./ApolloContext.js";

export interface AlterApolloContext<Context extends ApolloContext = ApolloContext> {
  $alterApolloContext(context: Context, $ctx: PlatformContext): Context | Promise<Context>;
}
