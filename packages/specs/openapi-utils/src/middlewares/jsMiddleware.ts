import {context} from "@tsed/di";
import Fs from "fs";
import {resolve} from "path";

/**
 * Expose a js file.
 * @param path
 */
export function jsMiddleware(path: string) {
  return () => {
    const ctx = context();

    const content = Fs.readFileSync(resolve(path), {encoding: "utf8"});
    ctx.response.setHeaders({"Content-Type": "application/javascript"}).status(200).body(content);
  };
}
