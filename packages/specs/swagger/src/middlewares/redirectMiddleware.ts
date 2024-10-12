import {PlatformContext} from "@tsed/platform-http";

/**
 * @ignore
 * @param path
 */
export function redirectMiddleware(path: string) {
  return (ctx: PlatformContext) => {
    if (ctx.request.method?.toUpperCase() === "GET" && ctx.request.url === path && !ctx.request.url.match(/\/$/)) {
      ctx.response.redirect(302, `${path}/`);
    }
  };
}
