import {Engine, EngineOptions} from "./Engine.js";
import {ViewEngine} from "../decorators/viewEngine.js";

@ViewEngine("velocityjs")
export class VelocityEngine extends Engine {
  protected $compile(template: string, options: EngineOptions) {
    return (options: EngineOptions) => {
      return Promise.resolve(this.engine.render(template, options).trimLeft());
    };
  }
}
