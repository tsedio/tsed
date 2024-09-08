import type {PlatformContext} from "@tsed/common";
import type {ApolloContext} from "./ApolloContext";

export interface AlterApolloContext<Context extends ApolloContext = ApolloContext> {
  $alterApolloContext(context: Context, $ctx: PlatformContext): Context | Promise<Context>;
}
