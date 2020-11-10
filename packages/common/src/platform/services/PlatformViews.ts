import {Env} from "@tsed/core";
import {Constant, Injectable} from "@tsed/di";
import * as cons from "consolidate";
import * as Fs from "fs";
import {extname, join, resolve} from "path";
import {
  PlatformViewsEngineOptions,
  PlatformViewsExtensionsTypes,
  PlatformViewsSupportedEngines
} from "../../config/interfaces/PlatformViewsSettings";

/**
 * @platform
 */
@Injectable()
export class PlatformViews {
  @Constant("env")
  env: Env;

  @Constant("views.root", `${process.cwd()}/views`)
  readonly root: string;

  @Constant("views.cache")
  readonly cache: boolean;

  @Constant("views.viewEngine", "ejs")
  readonly viewEngine: string;
  readonly consolidate: any = cons;

  @Constant("views.extensions", {})
  protected extensions: PlatformViewsExtensionsTypes;
  protected extensionsMap: Map<string, PlatformViewsSupportedEngines>;

  @Constant("views.options", {})
  protected engineOptions: PlatformViewsEngineOptions;

  $onInit() {
    this.extensionsMap = new Map(
      Object.entries({
        hbs: "handlebars",
        ejs: "ejs",
        ...this.extensions
      })
    );
    this.loadEngineRequires()
  }
  
  loadEngineRequires(){
    Object.keys(this.engineOptions)
    .map(engineType => {
      const options = this.getEngineOptions(engineType)
      if (options && options.requires)
        this.consolidate.requires[engineType] = options.requires
      })
    }

  getExtensions(): Map<string, PlatformViewsSupportedEngines> {
    return this.extensionsMap;
  }

  getEngines() {
    return Array.from(this.extensionsMap.entries())
      .map(([extension, engineType]) => {
        const engine = this.getEngine(engineType);

        return engine && {extension, engine};
      })
      .filter(Boolean);
  }

  getEngine(engineType: PlatformViewsSupportedEngines) {
    return this.consolidate[engineType];
  }

  getEngineOptions(engineType: PlatformViewsSupportedEngines) {
    return (engineType && this.engineOptions[engineType]) || {};
  }

  render(viewPath: string, options: any = {}) {
    const extension = (extname(viewPath) || this.viewEngine).replace(/\./, "");
    const engineType = this.getExtensions().get(extension)!;
    const engineOptions = this.getEngineOptions(engineType);
    const render = this.getEngine(engineType);

    if (!engineType || !render) {
      throw new Error(`Engine not found for the ".${extension}" file extension`);
    }

    return render(this.resolve(viewPath), Object.assign({cache: this.cache || this.env === Env.PROD}, engineOptions, options));
  }

  protected resolve(viewPath: string) {
    const extension = (extname(viewPath) || this.viewEngine).replace(/\./, "");

    viewPath = viewPath.replace(extname(viewPath), "") + "." + extension;

    return (
      [
        viewPath,
        resolve(join(this.root, viewPath)),
        resolve(join(process.cwd(), "views", viewPath)),
        resolve(join(process.cwd(), "public", viewPath))
      ].find((file) => Fs.existsSync(file)) || viewPath
    );
  }
}
