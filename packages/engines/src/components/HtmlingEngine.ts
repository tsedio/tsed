import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("htmling")
export class HtmlingEngine extends Engine {
  protected $compile(template: string) {
    const compile = this.engine.string(template);

    return (options: any) => compile.render(options);
  }
}
