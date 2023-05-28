import {promisify} from "util";
import {ViewEngine} from "../decorators/viewEngine";
import {Engine, EngineOptions} from "./Engine";

@ViewEngine("marko")
export class MarkoEngine extends Engine {
  $cacheOptions(template: string, options: any, fromFile: boolean): any {
    options.writeToDisk = !!options.cache;

    if (!fromFile) {
      options.filename = options.filename || "string.marko";
    }

    return options;
  }

  $compileFile(file: string, options: EngineOptions) {
    const $cmp = this.engine.load(file, options);

    return promisify($cmp.renderToString.bind($cmp)) as any;
  }

  protected $compile(template: string, options: EngineOptions) {
    const $cmp = this.engine.load(options.filename, template, options);

    return promisify($cmp.renderToString.bind($cmp)) as any;
  }
}
