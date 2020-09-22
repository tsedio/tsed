import {PlatformStaticsOptions} from "@tsed/common";
import {KoaCtx} from "@tsed/platform-koa";
import * as send from "koa-send";

export function staticsMiddleware(options: PlatformStaticsOptions) {
  if (options.index !== false) options.index = options.index || "index.html";

  return async (ctx: KoaCtx, next: any) => {
    if (["GET", "HEAD"].includes(ctx.method)) {
      let path = ctx.path;

      if (ctx._matchedRoute && ctx._matchedRoute !== "/") {
        path = path.replace(String(ctx._matchedRoute).replace("/(.*)", ""), "");
      }
      try {
        const done = await send(ctx, path, options as send.SendOptions);

        if (done) {
          return;
        }
      } catch (err) {
        if (err.status !== 404) {
          throw err;
        }
      }
    }

    return next();
  };
}
