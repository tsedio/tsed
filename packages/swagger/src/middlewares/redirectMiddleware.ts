import {PlatformContext} from "@tsed/common";

export function redirectMiddleware(path: string) {
  return (ctx: PlatformContext) => {
    if (ctx.request.url === path && !ctx.request.url.match(/\/$/)) {
      ctx.response.redirect(302, `${path}/`);
    }
  };
}
