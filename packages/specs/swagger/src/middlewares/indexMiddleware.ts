import {PlatformContext} from "@tsed/platform-http";

import {SwaggerSettings} from "../interfaces/SwaggerSettings.js";

/**
 * @ignore
 * @param viewPath
 * @param conf
 */
export function indexMiddleware(viewPath: string, conf: SwaggerSettings & {urls: string[]}) {
  return async (ctx: PlatformContext) => {
    const {path = "/", options = {}, showExplorer, cssPath, jsPath, urls} = conf;

    ctx.response.body(
      await ctx.response.render(viewPath, {
        spec: {},
        url: `${path}/swagger.json`,
        urls,
        showExplorer,
        cssPath,
        jsPath,
        swaggerOptions: options
      })
    );
  };
}
