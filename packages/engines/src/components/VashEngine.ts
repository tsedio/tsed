import {promisify} from "util";

import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("vash")
export class VashEngine extends Engine {
  compile(template: string, options: any): (options: any) => Promise<string> {
    if (options.helpers) {
      for (const key in options.helpers) {
        if (!options.helpers.hasOwnProperty(key) || typeof options.helpers[key] !== "function") {
          continue;
        }
        this.engine.helpers[key] = options.helpers[key];
      }
    }

    const compile = promisify(this.engine.compile(template, options));

    return async (options: any) => {
      const ctx = await compile(options);
      ctx.finishLayout();
      return ctx.toString();
    };
  }

  async render(template: string, options: any) {
    const compile = this.compile(template, options);

    const tpl = await compile(options);
    return tpl.replace(/\n$/, "");
  }
}
