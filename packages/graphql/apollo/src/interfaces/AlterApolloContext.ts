import type {ApolloContext} from "./ApolloContext.js";
import type {PlatformContext} from "@tsed/platform-http";

export interface AlterApolloContext<Context extends ApolloContext = ApolloContext> {
  $alterApolloContext(context: Context, $ctx: PlatformContext): Context | Promise<Context>;
}
