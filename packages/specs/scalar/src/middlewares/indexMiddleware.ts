import {basename, join} from "node:path";
import {ScalarSettings} from "../interfaces/ScalarSettings.js";
import {context} from "@tsed/di";

export function indexMiddleware(viewPath: string, conf: ScalarSettings) {
  return async () => {
    const ctx = context();
    const {path, options = {}, cssPath, cdn, fileName} = conf;

    const opts = {
      spec: {
        url: `${path}/${fileName}`
      },
      ...options
    };

    ctx.response.contentType("text/html").body(
      await ctx.response.render(viewPath, {
        cssPath: join(path, basename(cssPath)),
        cdn,
        serializedOptions: JSON.stringify(opts).split('"').join("&quot;"),
        options: opts
      })
    );
  };
}
