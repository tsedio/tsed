import {ViewEngine} from "../decorators/viewEngine.js";
import type {EngineOptions} from "./Engine.js";
import {Engine} from "./Engine.js";

@ViewEngine("velocityjs")
export class VelocityEngine extends Engine {
  protected $compile(template: string, options: EngineOptions) {
    return (options: EngineOptions) => {
      return Promise.resolve(this.engine.render(template, options).trimLeft());
    };
  }
}
