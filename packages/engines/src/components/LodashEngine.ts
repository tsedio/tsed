import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("lodash")
export class LodashEngine extends Engine {
  render(template: string, options: any) {
    const compile = this.compile(template, options);
    return compile(options).replace(/\n$/, "");
  }

  protected $compile(template: string, options: any) {
    return this.engine.template(template, options);
  }
}
