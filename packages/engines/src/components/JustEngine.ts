import {promisify} from "util";

import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("just")
export class JustEngine extends Engine {
  protected $compile(template: string, options: any) {
    const JUST = this.engine;
    const engine = new JUST({root: {page: template}});
    const compile = promisify(engine.render.bind(engine));

    return (options: any) => compile("page", options);
  }

  protected $compileFile(file: string, options: any) {
    const JUST = this.engine;
    const engine = new JUST(options);
    engine.configure({useCache: options.cache});
    const compile = promisify(engine.render.bind(engine));

    return Promise.resolve((options: any) => compile(file, options));
  }
}
