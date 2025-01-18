import {basename} from "node:path";
import {join} from "node:path";

import {context} from "@tsed/di";

import {ScalarSettings} from "../interfaces/ScalarSettings.js";

export function indexMiddleware(viewPath: string, conf: ScalarSettings) {
  return async () => {
    const ctx = context();
    const {path, options = {}, cssPath, cdn, fileName} = conf;

    const opts = {
      _integration: "tsed",
      spec: {
        url: `${path}/${fileName}`
      },
      ...options
    };

    ctx.response.body(
      await ctx.response.render(viewPath, {
        cssPath: join(path, basename(cssPath)),
        cdn,
        serializedOptions: JSON.stringify(opts).split('"').join("&quot;"),
        options: opts
      })
    );
  };
}
