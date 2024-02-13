import {PlatformContext} from "@tsed/common";

/**
 * @ignore
 * @param path
 */
export function redirectMiddleware(path: string) {
  return (ctx: PlatformContext) => {
    if (ctx.request.method === "GET" && ctx.request.url === path && !ctx.request.url.match(/\/$/)) {
      ctx.response.redirect(302, `${path}/`);
    }
  };
}
