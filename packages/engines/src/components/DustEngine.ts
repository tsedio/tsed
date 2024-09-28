import {extname} from "path";
import {promisify} from "util";

import {ViewEngine} from "../decorators/viewEngine.js";
import {read} from "../utils/cache.js";
import {Engine} from "./Engine.js";

@ViewEngine("dust", {
  requires: ["dustjs-helpers", "dustjs-linkedin"]
})
export class DustEngine extends Engine {
  private views = ".";
  private ext = "dust";

  configure(options: any) {
    if (options) {
      if (options.ext) {
        this.ext = options.ext;
      }
      if (options.views) {
        this.views = options.views;
      }
      if (options.settings && options.settings.views) {
        this.views = options.settings.views;
      }
    }
    if (!options || (options && !options.cache)) this.engine.cache = {};

    this.engine.onLoad = async (path: string, callback: any) => {
      if (extname(path) === "") {
        path += `.${this.ext}`;
      }
      if (path[0] !== "/") {
        path = `${this.views}/${path}`;
      }
      try {
        callback(null, await read(path, options));
      } catch (er) {
        callback(er);
      }
    };
  }

  protected $compile(template: string, options: any) {
    this.configure(options);

    let templateName;

    if (options.filename) {
      templateName = options.filename.replace(new RegExp("^" + this.views + "/"), "").replace(new RegExp("\\." + this.ext), "");
    }

    return promisify(this.engine.compileFn(template, templateName)) as any;
  }
}
