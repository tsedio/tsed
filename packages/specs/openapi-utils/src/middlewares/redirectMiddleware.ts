import {context} from "@tsed/di";

/**
 * Redirect to the same path with a trailing slash
 * @param path
 */
export function redirectMiddleware(path: string) {
  return () => {
    const ctx = context();

    if (ctx.request.method?.toUpperCase() === "GET" && ctx.request.url === path && !ctx.request.url.match(/\/$/)) {
      ctx.response.redirect(302, `${path}/`);
    }
  };
}
