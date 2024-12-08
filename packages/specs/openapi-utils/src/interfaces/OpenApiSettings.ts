import {OpenSpec2, OpenSpec3, OpenSpecVersions, OS2Versions, OS3Versions} from "@tsed/openspec";

export interface SwaggerUIOptions {
  configUrl?: string;
  url?: string;
  urls?: {url: string; name: string; primaryName?: string}[];
  layout?: string;
  validatorUrl?: string;
  oauth?: any;
  authorize?: any;

  [key: string]: any;
}

export interface OpenApiSettingsBase {
  /**
   * The url subpath to access to the documentation.
   */
  path: string;
  /**
   * Specify the spec version you want to generate.
   */
  specVersion?: OpenSpecVersions;
  /**
   * Swagger file name. By default swagger.json
   */
  fileName?: string;
  /**
   * The documentation key used by `@Docs` decorator to create several swagger documentations.
   */
  doc?: string;
  /**
   * The path to the CSS file.
   */
  cssPath?: string;
  /**
   * The path to the JS file.
   */
  jsPath?: string;
  /**
   * The path to the ejs file to create html page.
   */
  viewPath?: string | false;
  /**
   * Display the search field in the navbar.
   */
  showExplorer?: boolean;
  /**
   * Load the base spec documentation from the specified path.
   */
  specPath?: string;
  /**
   * Write the `swagger.json` spec documentation on the specified path.
   */
  outFile?: string;
  /**
   * Display the documentation in the browser.
   */
  hidden?: boolean;
  /**
   * Sort paths by alphabetical order
   */
  sortPaths?: boolean;
  /**
   * A function to generate the operationId.
   */
  operationIdFormatter?: (name: string, propertyKey: string, path: string) => string;
  /**
   * A pattern to generate the operationId. Format of operationId field (%c: class name, %m: method name).
   */
  operationIdPattern?: string;
  /**
   *
   */
  disableSpec?: boolean;
  /**
   * Include only controllers whose paths match the pattern list provided.
   */
  pathPatterns?: string[];
}

export interface Swagger2Settings extends OpenApiSettingsBase {
  specVersion?: OS2Versions;
  /**
   * OpenSpec 2
   */
  spec?: Partial<OpenSpec2>;
}

export interface OpenAPI3Settings extends OpenApiSettingsBase {
  specVersion?: OS3Versions;
  /**
   * OpenSpec 3
   */
  spec?: Partial<OpenSpec3>;
}

export type OpenApiSettings = Swagger2Settings | OpenAPI3Settings;
