import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("mustache")
export class MustacheEngine extends Engine {
  protected $compile(template: string, options: any) {
    return (options: any) => this.engine.render(template, options, options.partials);
  }
}
