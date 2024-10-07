import {v4} from "uuid";

import {injector} from "../../common/index.js";
import {DIContext} from "../domain/DIContext.js";
import {getContext} from "../utils/asyncHookContext.js";

/**
 * Get the current DIContext instance using async hook node.js api.
 *
 * ::: warning
 * This function isn't available in the browser context.
 * :::
 */
export function context<Ctx = DIContext>(): Ctx {
  return (
    getContext<Ctx>() ||
    (new DIContext({
      id: v4(),
      logger: injector().logger,
      injector: injector(),
      maxStackSize: 0
    }) as Ctx)
  );
}
