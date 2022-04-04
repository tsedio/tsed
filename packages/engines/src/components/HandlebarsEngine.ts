import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("handlebars")
export class HandlebarsEngine extends Engine {
  protected configure(options: any) {
    for (const partial in options.partials) {
      this.engine.registerPartial(partial, options.partials[partial]);
    }
    for (const helper in options.helpers) {
      this.engine.registerHelper(helper, options.helpers[helper]);
    }
  }

  protected $compile(template: string, options: any) {
    this.configure(options);
    return this.engine.compile(template, options);
  }
}
