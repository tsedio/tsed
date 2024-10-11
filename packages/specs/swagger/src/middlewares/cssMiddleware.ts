import {PlatformContext} from "@tsed/platform-http";
import Fs from "fs";
import {resolve} from "path";

/**
 * @ignore
 * @param path
 */
export function cssMiddleware(path: string) {
  return (ctx: PlatformContext) => {
    const content = Fs.readFileSync(resolve(path), {encoding: "utf8"});
    ctx.response
      .setHeaders({
        "Content-Type": "text/css"
      })
      .status(200)
      .body(content);
  };
}
