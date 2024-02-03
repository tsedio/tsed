import {BaseContext} from "@tsed/di";
import {Writable} from "stream";

export const PLATFORM_VIEWS_EXTENSIONS = {
  atpl: "atpl",
  bracket: "bracket",
  dot: "dot",
  dust: "dust",
  ect: "ect",
  ejs: "ejs",
  haml: "haml",
  "haml-coffee": "haml-coffee",
  hamlet: "hamlet",
  hbs: "handlebars",
  handlebars: "handlebars",
  hogan: "hogan",
  htmling: "htmling",
  jazz: "jazz",
  jqtpl: "jqtpl",
  just: "just",
  kernel: "kernel",
  liquid: "liquid",
  liquor: "liquor",
  lodash: "lodash",
  mote: "mote",
  mustache: "mustache",
  nunjucks: "nunjucks",
  plates: "plates",
  pug: "pug",
  qejs: "qejs",
  ractive: "ractive",
  razor: "razor",
  jsx: "react",
  slm: "slm",
  squirelly: "squirelly",
  swig: "swig",
  teacup: "teacup",
  templayed: "templayed",
  twig: "twig",
  underscore: "underscore",
  vash: "vash",
  velocityjs: "velocityjs",
  walrus: "walrus",
  whiskers: "whiskers"
};

export type PlatformViewsExtensionsTypes = Record<string, string>;

export interface PlatformViewsEngineOptions extends Record<string, unknown> {
  requires?: any;
}

export interface PlatformRenderOptions extends Record<string, unknown> {
  $ctx: BaseContext;
}

export interface PlatformViewWritableStream {
  pipe(stream: Writable): void;
}

export interface PlatformViewEngine {
  options: PlatformViewsEngineOptions;

  render(path: string, options: PlatformRenderOptions): Promise<string | PlatformViewWritableStream>;
}

export interface PlatformViewsSettings {
  disabled?: boolean;
  /**
   * Views directory.
   */
  root?: string;
  /**
   * Enable cache. Ts.ED enable cache in PRODUCTION profile by default.
   */
  cache?: boolean;
  /**
   * Provide extensions mapping to match the expected engines.
   */
  extensions?: Partial<PlatformViewsExtensionsTypes>;
  /**
   * Default view engine extension.
   * Allow omitting extension when using View decorator or render method.
   */
  viewEngine?: string;
  /**
   * Options mapping for each engine.
   */
  options?: Record<string, PlatformViewsEngineOptions>;
}

declare global {
  namespace TsED {
    interface Configuration {
      /**
       * Object to configure Views engines with Consolidate. See more on [View engine](/docs/template-engine.md).
       */
      views: PlatformViewsSettings;
    }
  }
}
