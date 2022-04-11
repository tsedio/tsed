import {Env, getValue} from "@tsed/core";
import {Constant, Module} from "@tsed/di";
import Fs from "fs";
import {extname, join, resolve} from "path";
import {
  PLATFORM_VIEWS_EXTENSIONS,
  PlatformViewEngine,
  PlatformViewsEngineOptions,
  PlatformViewsExtensionsTypes
} from "../domain/PlatformViewsSettings";

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

async function tryImport(name: string) {
  try {
    return await import(name);
  } catch (er) {
    // istanbul ignore next
  }
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

      await this.loadFromConsolidate();
      await this.loadFromTsedEngines();
    }
  }

  /**
   * @deprecated
   */
  async loadFromConsolidate() {
    const cons = await tryImport("consolidate");
    if (cons) {
      cons.requires.ejs = await patchEJS(cons.requires.ejs);

      this.#extensions.forEach((engineType) => {
        if ((cons as any)[engineType]) {
          const options = this.getEngineOptions(engineType);

          if (options.requires) {
            (cons.requires as any)[engineType] = options.requires;
          }

          this.registerEngine(engineType, {
            options,
            render: (cons as any)[engineType]
          });
        }
      });
    }
  }

  async loadFromTsedEngines() {
    const tsed = await tryImport("@tsed/engines");

    if (tsed) {
      tsed.requires.set("ejs", await patchEJS(tsed.requires.get("ejs")));

      this.#extensions.forEach((engineType) => {
        if (tsed.engines.has(engineType)) {
          const options = this.getEngineOptions(engineType);

          if (options.requires) {
            tsed.requires.set(engineType, options.requires);
          }

          this.registerEngine(engineType, {
            options,
            render: tsed.getEngine(engineType)
          });
        }
      });
    }
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

  async render(viewPath: string, options: any = {}): Promise<string> {
    const {path, extension} = this.#cachePaths.get(viewPath) || this.#cachePaths.set(viewPath, this.resolve(viewPath)).get(viewPath)!;
    const engine = this.getEngine(extension);

    if (!engine) {
      throw new Error(`Engine not found to render the following "${viewPath}"`);
    }

    return engine.render(path, Object.assign({cache: this.cache || this.env === Env.PROD}, engine.options, options));
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
