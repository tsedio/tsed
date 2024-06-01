import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("dot")
export class DotEngine extends Engine {
  getSettings(options: any) {
    const settings = Object.assign({}, this.engine.templateSettings);
    return Object.assign(settings, options ? options.dot : {});
  }

  protected $compile(template: string, options: any) {
    return this.engine.template(template, this.getSettings(options), options);
  }
}
