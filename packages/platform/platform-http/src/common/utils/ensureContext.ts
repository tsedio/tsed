import {getContext, runInContext} from "@tsed/di";

import {PlatformContext} from "../domain/PlatformContext.js";

export function ensureContext(request: any, cb: ($ctx: PlatformContext) => any, fallback?: () => void) {
  const $ctx = getContext<PlatformContext>();

  if ($ctx) {
    return cb($ctx);
  }

  if (!request?.$ctx && fallback) {
    return fallback();
  }

  return runInContext(request.$ctx, () => cb(request.$ctx));
}
