import {Engine} from "./Engine.js";
import {ViewEngine} from "../decorators/viewEngine.js";
import {existsSync} from "node:fs";

@ViewEngine("twing")
export class TwingEngine extends Engine {
  protected $compile(template: string, options: any): (options: any) => Promise<string> {
    const engine = this.engine;

    if (options.settings && options.settings.views && existsSync(options.settings.views)) {
      const loader = engine.createFilesystemLoader(options.settings.views);
      const environment = engine.createEnvironment(loader);

      return async (options: any) => {
        return environment.render(template, options);
      };
    }

    return async (options: any) => {
      const loader = engine.createArrayLoader({
        "index.twig": template
      });
      const environment = engine.createEnvironment(loader);

      return environment.render("index.twig", options);
    };
  }
}
