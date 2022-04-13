import {ViewEngine} from "../decorators/viewEngine";
import {Engine, EngineOptions} from "./Engine";

@ViewEngine("twig")
export class TwigEngine extends Engine {
  protected $cacheOptions(template: string, options: any) {
    return {
      ...options,
      data: template,
      allowInlineIncludes: options.allowInlineIncludes,
      namespaces: options.namespaces,
      path: options.path
    };
  }

  protected $compile(template: string, options: EngineOptions) {
    const {twig: engine} = this.engine;
    options.data = template;

    const compile = engine(options);

    return (options: EngineOptions) => compile.render(options);
  }
}
