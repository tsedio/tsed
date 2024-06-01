import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine, EngineOptions} from "./Engine.js";

@ViewEngine("ractive")
export class RactiveEngine extends Engine {
  protected $compile(template: string, options: EngineOptions) {
    const Engine = this.engine;
    const compile = this.engine.parse(template);
    Engine.DEBUG = false;
    return (options: EngineOptions) => {
      options.template = compile;
      return new Engine(this.clean(options)).toHTML();
    };
  }

  protected clean(options: any) {
    if (options.data === null || options.data === undefined) {
      // Shallow clone the options object
      options.data = Object.assign({}, options);

      // Remove consolidate-specific properties from the clone
      let i;
      let length;
      let properties = ["template", "filename", "cache", "partials"];

      for (i = 0, length = properties.length; i < length; i++) {
        const property = properties[i];
        delete options.data[property];
      }
    }

    return options;
  }
}
