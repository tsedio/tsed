import {basename} from "node:path";
import {join} from "node:path";

import {context} from "@tsed/di";
import {PlatformContext} from "@tsed/platform-http";

import {SwaggerSettings} from "../interfaces/SwaggerSettings.js";

/**
 * @ignore
 * @param viewPath
 * @param conf
 */
export function indexMiddleware(viewPath: string, conf: SwaggerSettings & {urls: string[]}) {
  return async () => {
    const ctx = context();
    const {path, options = {}, fileName, showExplorer, cssPath, jsPath, urls} = conf;

    ctx.response.body(
      await ctx.response.render(viewPath, {
        spec: {},
        url: `${path}/${fileName}`,
        urls,
        showExplorer,
        cssPath: cssPath && join(path, basename(cssPath)),
        jsPath: jsPath && join(path, basename(jsPath)),
        swaggerOptions: options
      })
    );
  };
}
