import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("jazz")
export class JazzEngine extends Engine {
  protected $compile(template: string, options: any) {
    const compile = this.engine.compile(template, options);
    return (options: any) => new Promise<string>((resolve) => compile.eval(options, resolve));
  }
}
