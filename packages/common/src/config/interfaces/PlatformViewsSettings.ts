export type PlatformViewsSupportedEngines =
  | "arc-templates"
  | "atpl"
  | "bracket"
  | "dot"
  | "dust"
  | "eco"
  | "ejs"
  | "ect"
  | "haml"
  | "haml-coffee"
  | "hamlet"
  | "handlebars"
  | "hogan"
  | "htmling"
  | "jade"
  | "jazz"
  | "jqtpl"
  | "just"
  | "liquid"
  | "liquor"
  | "lodash"
  | "marko"
  | "mote"
  | "mustache"
  | "nunjucks"
  | "plates"
  | "pug"
  | "qejs"
  | "ractive"
  | "razor"
  | "react"
  | "slm"
  | "squirrelly"
  | "swig"
  | "teacup"
  | "templayed"
  | "toffee"
  | "twig"
  | "underscore"
  | "vash"
  | "velocityjs"
  | "walrus"
  | "whiskers";

export type PlatformViewsExtensionsTypes = {[key: string]: string};

export type PlatformViewsEngineOptions = {
  [engine in PlatformViewsSupportedEngines]: any;
};

export interface PlatformViewsSettings {
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
  options?: Partial<PlatformViewsEngineOptions>;
}
