import {readFileSync} from "fs";
import {resolve} from "path";

import {ViewEngine} from "../decorators/viewEngine.js";
import {getCachedEngine, getFromCache, importEngine, setToCache} from "../utils/cache.js";
import {Engine, EngineOptions, ViewEngineOptions} from "./Engine.js";

@ViewEngine("react", {
  requires: ["react"]
})
export class ReactEngine extends Engine {
  constructor(name: string, options: ViewEngineOptions) {
    super(name, options);
    this.patchRequire();
  }

  async $onInit() {
    await super.$onInit();
    await importEngine("react-dom/server", "ReactDOM");
    await importEngine("@babel/core", "babel");
  }

  get babel() {
    return getCachedEngine("babel");
  }

  get reactDOM() {
    return getCachedEngine("ReactDOM");
  }

  protected patchRequire() {
    if (require.extensions) {
      // Ensure JSX is transformed on require
      if (!require.extensions[".jsx"]) {
        require.extensions[".jsx"] = this.requireReact.bind(this);
      }

      // Supporting .react extension as well as test cases
      // Using .react extension is not recommended.
      if (!require.extensions[".react"]) {
        require.extensions[".react"] = this.requireReact.bind(this);
      }
    }
  }

  protected configure(options: EngineOptions) {
    const base = options.base;
    delete options.base;

    const enableCache = options.cache;
    delete options.cache;

    const isNonStatic = options.isNonStatic;
    delete options.isNonStatic;
    return {base, enableCache, isNonStatic};
  }

  protected $compile(template: string, options: EngineOptions) {
    // Assign HTML Base
    const {base, enableCache, isNonStatic} = this.configure(options);

    // Start Conversion
    const Code = this.requireReactString(template);
    const Factory = this.engine.createFactory(Code);

    return () => {
      const parsed = new Factory(options);
      const content = isNonStatic ? this.reactDOM.renderToString(parsed) : this.reactDOM.renderToStaticMarkup(parsed);

      if (base) {
        options.content = content;

        return this.renderWithBase(template, base, enableCache, options);
      }

      return content;
    };
  }

  protected async $compileFile(file: string, options: EngineOptions) {
    // Assign HTML Base
    const {base, enableCache, isNonStatic} = this.configure(options);

    let path = resolve(file);
    delete require.cache[path];

    const ReactDOM = await importEngine("react-dom/server", "ReactDOM");

    const {default: Code} = await import(path);
    const Factory = this.engine.createFactory(Code);

    return () => {
      const parsed = new Factory(options);
      const content = isNonStatic ? ReactDOM.renderToString(parsed) : ReactDOM.renderToStaticMarkup(parsed);

      if (base) {
        options.content = content;

        return this.renderWithBase(file, base, enableCache, options);
      }

      return content;
    };
  }

  protected renderWithBase(key: string, base: any, enableCache: undefined | boolean, options: EngineOptions) {
    const baseStr = getFromCache(key) || readFileSync(resolve(base), "utf8");

    if (enableCache) {
      setToCache(key, baseStr);
    }

    return this.reactBaseTmpl(baseStr, options);
  }

  protected transformFileSync(filename: string) {
    return this.babel.transformFileSync(filename, {presets: ["@babel/preset-react"]}).code;
  }

  protected transform(src: string) {
    return this.babel.transform(src, {presets: ["@babel/preset-react"]}).code;
  }

  protected requireReact(module: any, filename: string) {
    const compiled = this.transformFileSync(filename);
    return module._compile(compiled, filename);
  }

  protected requireReactString(src: string, filename?: string) {
    if (!filename) filename = "";
    // @ts-ignore
    const m = new module.constructor();
    filename = filename || "";

    // Compile Using React
    const compiled = this.transform(src);

    // Compile as a module
    m.paths = module.paths;
    m._compile(compiled, filename);

    return m.exports;
  }

  protected reactBaseTmpl(data: any, options: any) {
    let exp: any;
    let regex: any;

    // Iterates through the keys in file object
    // and interpolate / replace {{key}} with it's value
    for (const k in options) {
      if (options.hasOwnProperty(k)) {
        exp = `{{${k}}}`;
        regex = new RegExp(exp, "g");
        if (data.match(regex)) {
          data = data.replace(regex, options[k]);
        }
      }
    }

    return data;
  }
}
