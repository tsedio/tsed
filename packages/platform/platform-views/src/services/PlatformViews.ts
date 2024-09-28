import {Env, getValue} from "@tsed/core";
import {Constant, Inject, InjectorService, Module} from "@tsed/di";
import {engines, getEngine, requires} from "@tsed/engines";
import Fs from "fs";
import {extname, join, resolve} from "path";

import {
  PLATFORM_VIEWS_EXTENSIONS,
  PlatformViewEngine,
  PlatformViewsEngineOptions,
  PlatformViewsExtensionsTypes,
  PlatformViewWritableStream
} from "../domain/PlatformViewsSettings.js";

async function patchEJS(ejs: any) {
  if (!ejs) {
    const mod = await import("ejs");
    ejs = mod.default;
  }

  return {
    compile(str: string, {client, ...options}: any) {
      return ejs.compile(str, options);
    }
  };
}

/**
 * @platform
 */
@Module({
  views: {
    exists: true
  }
})
export class PlatformViews {
  @Constant("env")
  env: Env;

  @Constant("views.root", `${process.cwd()}/views`)
  readonly root: string;

  @Constant("views.cache")
  readonly cache: boolean;

  @Constant("views.disabled", false)
  readonly disabled: string;

  @Constant("views.viewEngine", "ejs")
  readonly viewEngine: string;

  @Constant("views.extensions", {})
  protected extensionsOptions: PlatformViewsExtensionsTypes;

  @Constant("views.options", {})
  protected engineOptions: Record<string, PlatformViewsEngineOptions>;

  @Inject()
  protected injector: InjectorService;

  #extensions: Map<string, string>;
  #engines = new Map<string, PlatformViewEngine>();
  #cachePaths = new Map<string, {path: string; extension: string}>();

  async $onInit() {
    if (!this.disabled) {
      this.#extensions = new Map(
        Object.entries({
          ...PLATFORM_VIEWS_EXTENSIONS,
          ...this.extensionsOptions
        })
      );

      await this.loadEngines();
    }
  }

  async loadEngines() {
    requires.set("ejs", await patchEJS(requires.get("ejs")));

    this.#extensions.forEach((engineType) => {
      if (engines.has(engineType)) {
        const options = this.getEngineOptions(engineType);

        if (options.requires) {
          requires.set(engineType, options.requires);
        }

        this.registerEngine(engineType, {
          options,
          render: getEngine(engineType)
        });
      }
    });
  }

  getEngines() {
    return [...this.#extensions.entries()].map(([extension, engineType]) => {
      const engine = this.getEngine(this.getExtension(engineType))!;

      return {
        extension,
        engine
      };
    });
  }

  registerEngine(engineType: string, engine: PlatformViewEngine) {
    this.#engines.set(engineType, engine);

    return this;
  }

  getEngine(type: string) {
    return this.#engines.get(this.#extensions.get(type) || type);
  }

  getEngineOptions(engineType: string): PlatformViewsEngineOptions {
    return getValue(this.engineOptions, engineType, {});
  }

  async render(viewPath: string, options: any = {}): Promise<string | PlatformViewWritableStream> {
    const {$ctx} = options;
    options = await this.injector.alterAsync("$alterRenderOptions", options, $ctx);

    const {path, extension} = this.#cachePaths.get(viewPath) || this.#cachePaths.set(viewPath, this.resolve(viewPath)).get(viewPath)!;
    const engine = this.getEngine(extension);

    if (!engine) {
      throw new Error(`Engine not found to render the following "${viewPath}"`);
    }

    const finalOpts = Object.assign({cache: this.cache || this.env === Env.PROD}, engine.options, options, {$ctx});

    return engine.render(path, finalOpts);
  }

  protected getExtension(viewPath: string) {
    return (extname(viewPath) || this.viewEngine).replace(/\./, "");
  }

  protected resolve(viewPath: string) {
    const extension = this.getExtension(viewPath);

    viewPath = viewPath.replace(extname(viewPath), "") + "." + extension;

    const path =
      [
        viewPath,
        resolve(join(this.root, viewPath)),
        resolve(join(process.cwd(), "views", viewPath)),
        resolve(join(process.cwd(), "public", viewPath))
      ].find((file) => Fs.existsSync(file)) || viewPath;

    return {
      path,
      extension
    };
  }
}
