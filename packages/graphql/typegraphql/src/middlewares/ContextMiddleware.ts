import {type DIContext, runInContext, useContext} from "@tsed/di";
import type {MiddlewareFn} from "type-graphql";

export const ContextMiddleware: MiddlewareFn<{req: {$ctx: DIContext}}> = (action, next) => {
  const $ctx = useContext(action.context?.req?.$ctx);
  return runInContext($ctx, next);
};
