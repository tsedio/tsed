import {getContext, PlatformContext, runInContext} from "@tsed/common";
import {MiddlewareFn} from "type-graphql";

export const ContextMiddleware: MiddlewareFn<{req: {$ctx: PlatformContext}}> = (_, next) => {
  return runInContext(getContext(), next);
};
