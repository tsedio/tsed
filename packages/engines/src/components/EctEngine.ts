import {promisify} from "util";
import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("ect")
export class EctEngine extends Engine {
  protected $compile(template: string, options: any) {
    const ECT = this.engine;
    const engine = new ECT({root: {page: template}});
    const compile = promisify(engine.render.bind(engine));

    return (options: any) => compile("page", options);
  }

  protected async $compileFile(file: string, options: any) {
    const ECT = this.engine;
    const engine = new ECT(options);
    engine.configure({cache: options.cache});
    const compile = promisify(engine.render.bind(engine));

    return (options: any) => compile(file, options);
  }
}
