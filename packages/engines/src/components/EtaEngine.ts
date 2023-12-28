import {ViewEngine} from "../decorators/viewEngine";
import {Engine, EngineOptions} from "./Engine";

@ViewEngine("eta", {
  requires: "eta"
})
export class EtaEngine extends Engine {
  protected cache = new Map();

  protected getEngine(options: EngineOptions) {
    const root = options.root;
    const key = String(root || "default");

    if (!this.cache.get(key)) {
      const {Eta} = this.engine;

      this.cache.set(
        key,
        new Eta({
          ...options,
          views: root
        })
      );
    }

    return this.cache.get(key);
  }

  protected $compile(template: string, options: any) {
    const eta = this.getEngine(options);

    return () => eta.renderStringAsync(template, options);
  }

  protected $compileFile(file: string, options: EngineOptions): Promise<(options: EngineOptions) => Promise<string>> {
    const root = options.views || options.root;
    const templateName = file.replace(root, "");
    const eta = this.getEngine({
      ...options,
      root
    });

    return Promise.resolve(() => eta.renderAsync(templateName, options));
  }
}
