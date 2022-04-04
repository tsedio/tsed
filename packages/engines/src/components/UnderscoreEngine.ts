import {ViewEngine} from "../decorators/viewEngine";
import {Engine} from "./Engine";

@ViewEngine("underscore")
export class UnderscoreEngine extends Engine {
  async render(template: string, options: any) {
    const tpl: string = await this.compile(template, options)(options);
    return tpl.replace(/\n$/, "");
  }

  protected $cacheOptions(template: string, options: any): any {
    const partials: any = {};

    for (const partial in options.partials) {
      partials[partial] = this.engine.template(options.partials[partial]);
    }

    options.partials = partials;

    return options;
  }

  protected $compile(template: string, options: any): (options: any) => Promise<string> {
    return this.engine.template(template, null, options);
  }
}
