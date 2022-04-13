import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("jqtpl")
export class JqtplEngine extends Engine {
  protected $compile(template: string, options: any) {
    this.engine.template(template, template);
    return (options: any) => this.engine.tmpl(template, options);
  }
}
