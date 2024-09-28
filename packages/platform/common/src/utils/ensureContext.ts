import {getContext} from "@tsed/di";

import {PlatformContext} from "../domain/PlatformContext.js";

export function ensureContext(request: any, cb: ($ctx: PlatformContext) => any, fallback?: () => void) {
  const $ctx = getContext<PlatformContext>();

  if ($ctx) {
    return cb($ctx);
  }

  if (!request?.$ctx && fallback) {
    return fallback();
  }

  return request.$ctx.runInContext(() => cb(request.$ctx));
}
