import {cache, getCachedEngine, importEngine, read, readPartials} from "../utils/cache";

export interface ViewEngineOptions {
  requires?: string | string[];
}

export interface EngineOptions {
  cache?: boolean;

  [otherOptions: string]: any;
}

export class Engine {
  protected driverName: string;

  constructor(readonly name: string, readonly options: ViewEngineOptions) {}

  get engine(): any {
    return getCachedEngine(this.name);
  }

  async $onInit() {
    await this.importEngine(this.name, this.options);
  }

  compile(template: string, options: EngineOptions) {
    options = this.$cacheOptions(template, options, false);

    return cache(options) || cache(options, this.$compile.call(this, template, options));
  }

  compileFile(file: string, options: EngineOptions) {
    options = this.$cacheOptions(file, options, true);

    return cache(options) || cache(options, this.$compileFile.call(this, file, options));
  }

  async render(template: string, options: EngineOptions) {
    const compile = await this.compile(template, options);

    return compile(options);
  }

  async renderFile(file: string, options: EngineOptions) {
    const opts = await this.readPartials(file, options);
    const compile = await this.compileFile(file, opts);

    return compile(opts);
  }

  protected async readPartials(file: string, options: EngineOptions) {
    options.filename = file;
    const partials = await readPartials(file, options);

    const opts = Object.assign({}, options);
    opts.partials = partials;

    return opts;
  }

  protected $cacheOptions(template: string, options: EngineOptions, fromFile?: boolean) {
    return options;
  }

  protected $compile(template: string, options: EngineOptions): (options: EngineOptions) => Promise<string> {
    return this.engine.compile(template, options);
  }

  protected async $compileFile(file: string, options: EngineOptions) {
    const template = await read(file, options);
    return this.$compile(template, options);
  }

  protected async importEngine(name: string, options: ViewEngineOptions) {
    const reqs = ([] as string[]).concat(options.requires || [name]);

    for (const req of reqs) {
      try {
        await importEngine(req, name);
        this.driverName = req;
      } catch (er) {}
    }
  }
}
