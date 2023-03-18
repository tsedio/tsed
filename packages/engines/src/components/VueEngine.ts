import filedirname from "filedirname";
import {join, resolve} from "path";
import {promisify} from "util";
import {ViewEngine} from "../decorators/viewEngine";
import {getCachedEngine, importEngine} from "../utils/cache";
import {Engine, EngineOptions} from "./Engine";
// FIXME remove when esm is ready
const [, rootDir] = filedirname();

function requireFromString(src: string, filename: string) {
  const Module: any = module.constructor;
  const m = new Module();
  m._compile(src, filename);
  return m.exports;
}

/**
 *  simple hash a string
 *  https://stackoverflow.com/a/34842797/493756
 */

function hashCode(str: string) {
  return str.split("").reduce((prevHash, currVal) => (prevHash << 5) - prevHash + currVal.charCodeAt(0), 0);
}

@ViewEngine("vue", {
  requires: "vue"
})
export class VueEngine extends Engine {
  #renderToString: any;

  get pronto() {
    return getCachedEngine("pronto");
  }

  get vueify() {
    return getCachedEngine("vueify");
  }

  get vueServerRenderer() {
    return getCachedEngine("vue-server-renderer");
  }

  async $onInit() {
    await super.$onInit();
    await importEngine("vue-pronto/lib/index", "pronto");
    await importEngine("vueify");
    await importEngine("vue-server-renderer");
    const ssrRenderer = this.vueServerRenderer.createRenderer();

    this.#renderToString = promisify(ssrRenderer.renderToString.bind(this));
  }

  protected $cacheOptions(template: string, options: EngineOptions, fromFile?: boolean): EngineOptions {
    const fullPath = join(rootDir, `/${hashCode(template)}`);

    if (!fromFile) {
      return {
        ...options,
        filename: fullPath
      };
    }

    return options;
  }

  protected $compile(template: string, options: EngineOptions) {
    // make up a fake path
    const fullPath = join(rootDir, `/${hashCode(template)}`);
    const promise = this.getComponent(fullPath, template, options);

    return async (options: EngineOptions) => {
      return this.renderComponent(await promise, options);
    };
  }

  protected async $compileFile(file: string, options: EngineOptions) {
    // prontoRenderer assume that the filepath is relative to a passed "rootpath"
    // and if you don't pass a rootpath it will try to find one
    // based on its current rootDir
    // https://github.com/express-vue/vue-pronto/blob/c88e380fee8656bc3ed21c7d3adb2ef331be07d5/lib/utils/findPaths.js#L10-L18
    const fullPath = resolve(file);
    const rootPath = process.cwd();
    const filepath = fullPath.replace(`${rootPath}/`, "");
    const prontoOptions: any = {
      rootPath,
      vueVersion: {disabled: true}
    };

    if (!options.cache) {
      // disable pronto lru cache
      prontoOptions.cacheOptions = {max: 0};
    }

    let prontoRenderer = new this.pronto.ProntoVueify(prontoOptions);

    if (!options.cache) {
      // disable pronto internal cache
      // yup
      prontoRenderer.internalCache = {
        get: () => {},
        set: () => {}
      };
    } else {
      // so, this ties each "renderer" to a rootPath
      // so I have to create a new prontoRenderer each time
      // which sucks! because I loose the internal cache of it,
      // unless, I keep tabs on both lru and internal caches and replace them every time.
      const internalCache = prontoRenderer.internalCache;

      prontoRenderer.internalCache = {
        get: internalCache.get.bind(internalCache),
        set(filename: string, component: any) {
          internalCache.set(filename, {
            ...component,
            data: component.data || (() => options)
          });
        }
      };
    }

    return (options: EngineOptions) => {
      return prontoRenderer.RenderToString(
        filepath,
        {},
        {
          propsData: options
        }
      );
    };
  }

  private async getComponent(fullPath: string, template: string, options: EngineOptions) {
    // assume that the str the content of a <template> ... </template>
    if (/<template/.test(template.trim())) {
      // assume that the str is a fileContent of a .vue file
      const compile = promisify(this.vueify.compiler.compile.bind(this.vueify.compiler));
      const cmp = await compile(template, fullPath);
      return requireFromString(cmp, fullPath);
    }

    return {
      template,
      data() {
        return options;
      }
    };
  }

  private async renderComponent(Component: any, options: EngineOptions) {
    let Factory = this.engine.extend(Component);
    let instance = new Factory({propsData: options});

    return this.#renderToString(instance);
  }
}
