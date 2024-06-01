import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine, EngineOptions} from "./Engine.js";

@ViewEngine("squirrelly")
export class SquirrellyEngine extends Engine {
  protected $compile(template: string, options: EngineOptions) {
    for (const partial in options.partials) {
      this.engine.definePartial(partial, options.partials[partial]);
    }
    for (const helper in options.helpers) {
      this.engine.defineHelper(helper, options.helpers[helper]);
    }

    const compile = this.engine.Compile(template, options);

    return (options: EngineOptions) => compile(options, this.engine);
  }
}
