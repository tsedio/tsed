import Fs from "node:fs";
import {resolve} from "node:path";

import {context} from "@tsed/di";

/**
 * Expose a css file.
 * @param path
 */
export function cssMiddleware(path: string) {
  return () => {
    const ctx = context();

    const content = Fs.readFileSync(resolve(path), {encoding: "utf8"});

    ctx.response
      .setHeaders({
        "Content-Type": "text/css"
      })
      .status(200)
      .body(content);
  };
}
