import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("jqtpl")
export class JqtplEngine extends Engine {
  protected $compile(template: string, options: any) {
    this.engine.template(template, template);
    return (options: any) => this.engine.tmpl(template, options);
  }
}
