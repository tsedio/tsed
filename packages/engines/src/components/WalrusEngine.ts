import {Engine} from "./Engine.js";
import {ViewEngine} from "../decorators/viewEngine.js";

@ViewEngine("walrus")
export class WalrusEngine extends Engine {
  protected $compile(template: string, options: any) {
    const compile = this.engine.parse(template);

    return (options: any) => compile.compile(options);
  }
}
