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
  path?: string;
  extensions?: Partial<PlatformViewsExtensionsTypes>;
  viewEngine?: string;
  options?: Partial<PlatformViewsEngineOptions>;
}
