import {existsSync} from "fs";

import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("twing")
export class TwingEngine extends Engine {
  private instance: any;

  protected $compile(template: string, options: any): (options: any) => Promise<string> {
    const engine = this.engine;

    if (!this.instance) {
      let loader = new engine.TwingLoaderNull();

      if (options.settings && options.settings.views && existsSync(options.settings.views)) {
        loader = new engine.TwingLoaderFilesystem(options.settings.views);
      }

      this.instance = new engine.TwingEnvironment(loader);
    }

    const $cmp = this.instance.createTemplate(template);

    return async (options: any) => {
      const compile = await $cmp;

      return compile.render(options);
    };
  }
}
