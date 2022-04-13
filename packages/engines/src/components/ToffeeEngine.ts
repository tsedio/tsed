import {promisify} from "util";
import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("toffee")
export class ToffeeEngine extends Engine {
  protected $compile(template: string, options: any) {
    const compile = promisify(this.engine.str_render.bind(this.engine));

    return (options: any) => compile(template, options);
  }

  protected async $compileFile(file: string, options: any) {
    const compile = promisify(this.engine.__consolidate_engine_render.bind(this.engine));

    return (options: any) => compile(file, options);
  }
}
