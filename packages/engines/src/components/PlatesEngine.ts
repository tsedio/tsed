import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("plates")
export class PlatesEngine extends Engine {
  protected $compile(template: string, options: any) {
    return (options: any) => {
      const map = options.map || undefined;
      return this.engine.bind(template, options, map);
    };
  }
}
