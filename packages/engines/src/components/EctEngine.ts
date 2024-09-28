import {promisify} from "util";

import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("ect")
export class EctEngine extends Engine {
  protected $compile(template: string, options: any) {
    const ECT = this.engine;
    const engine = new ECT({root: {page: template}});
    const compile = promisify(engine.render.bind(engine));

    return (options: any) => compile("page", options);
  }

  protected $compileFile(file: string, options: any): Promise<(options: any) => any> {
    const ECT = this.engine;
    const engine = new ECT(options);
    engine.configure({cache: options.cache});
    const compile = promisify(engine.render.bind(engine));

    return Promise.resolve((options: any) => compile(file, options));
  }
}
