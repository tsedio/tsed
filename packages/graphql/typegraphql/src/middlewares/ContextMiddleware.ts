import {type DIContext, getContext, runInContext} from "@tsed/di";
import {MiddlewareFn} from "type-graphql";

export const ContextMiddleware: MiddlewareFn<{req: {$ctx: DIContext}}> = (action, next) => {
  const $ctx = getContext(action.context?.req?.$ctx);
  return runInContext($ctx, next);
};
