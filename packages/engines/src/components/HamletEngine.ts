import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("hamlet")
export class HamletEngine extends Engine {
  protected $compile(template: string, options: any) {
    return (options: any) => {
      options.locals = options;
      return Promise.resolve(this.engine.render(template, options).trimLeft());
    };
  }
}
