import {Engine} from "./Engine.js";
import {ViewEngine} from "../decorators/viewEngine.js";

@ViewEngine("htmling")
export class HtmlingEngine extends Engine {
  protected $compile(template: string) {
    const compile = this.engine.string(template);

    return (options: any) => compile.render(options);
  }
}
