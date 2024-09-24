import {promisify} from "util";

import {ViewEngine} from "../decorators/viewEngine.js";
import {Engine} from "./Engine.js";

@ViewEngine("nunjucks")
export class NunjucksEngine extends Engine {
  protected configure(options: any) {
    const engine = options.nunjucksEnv || this.engine;
    let env = engine;

    // deprecated fallback support for express
    // <https://github.com/tj/consolidate.js/pull/152>
    // <https://github.com/tj/consolidate.js/pull/224>
    if (options.settings && options.settings.views) {
      env = engine.configure(options.settings.views);
    } else if (options.nunjucks && options.nunjucks.configure) {
      env = engine.configure.apply(engine, options.nunjucks.configure);
    }

    //
    // because `renderString` does not initiate loaders
    // we must manually create a loader for it based off
    // either `options.settings.views` or `options.nunjucks` or `options.nunjucks.root`
    //
    // <https://github.com/mozilla/nunjucks/issues/730>
    // <https://github.com/crocodilejs/node-email-templates/issues/182>
    //

    // so instead we simply check if we passed a custom loader
    // otherwise we create a simple file based loader
    if (options.loader) {
      return new engine.Environment(options.loader);
    }

    if (options.settings && options.settings.views) {
      return new engine.Environment(new engine.FileSystemLoader(options.settings.views));
    }

    if (options.nunjucks && options.nunjucks.loader) {
      if (typeof options.nunjucks.loader === "string") {
        return new engine.Environment(new engine.FileSystemLoader(options.nunjucks.loader));
      }

      return new engine.Environment(new engine.FileSystemLoader(options.nunjucks.loader[0], options.nunjucks.loader[1]));
    }

    return env;
  }

  protected $compile(template: string, options: any) {
    let engine = this.configure(options);

    const render = promisify(engine.renderString.bind(engine));

    return (options: any) => render(template, options);
  }
}
