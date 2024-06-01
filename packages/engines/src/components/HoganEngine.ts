import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine, EngineOptions} from "./Engine.js";

@ViewEngine("hogan", {
  requires: "hogan.js"
})
export class HoganEngine extends Engine {
  protected $compile(template: string, options: EngineOptions) {
    const compile = this.engine.compile(template, options);
    return (options: EngineOptions) => {
      return compile.render(options, options.partials);
    };
  }
}
