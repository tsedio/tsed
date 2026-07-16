import {Engine} from "./Engine.js";
import {ViewEngine} from "../decorators/viewEngine.js";

@ViewEngine("pug", {
  requires: ["pug", "then-pug"]
})
export class PugEngine extends Engine {
  protected $compile(template: string, options: any) {
    return this.engine.compile(template, options);
  }

  protected $compileFile(file: string, options: any) {
    return this.engine.compileFile(file, options);
  }
}
