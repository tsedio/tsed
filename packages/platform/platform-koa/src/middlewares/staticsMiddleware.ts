import {PlatformStaticsOptions} from "@tsed/platform-http";
import type {Context} from "koa";
import send from "koa-send";

/**
 * @ignore
 * @param options
 */
export function staticsMiddleware(options: PlatformStaticsOptions): any {
  if (options.index !== false) options.index = options.index || "index.html";

  return async (ctx: Context, next: any) => {
    if (["GET", "HEAD"].includes(ctx.method) && !ctx.body) {
      let path = ctx.path;

      if (ctx._matchedRoute && ctx._matchedRoute !== "/") {
        path = path.replace(String(ctx._matchedRoute).replace("/(.*)", ""), "");
      }
      try {
        const done = await send(ctx as any, path, options as send.SendOptions);

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
