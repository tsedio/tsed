import {
  BodyParameter,
  ExternalDocs,
  Info,
  Path,
  QueryParameter,
  Response,
  Schema,
  Security,
  Tag
} from "swagger-schema-official";

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

export interface SwaggerSpec {
  swagger?: string;
  info?: Info;
  externalDocs?: ExternalDocs;
  host?: string;
  basePath?: string;
  schemes?: string[];
  consumes?: string[];
  produces?: string[];
  paths?: {[pathName: string]: Path};
  definitions?: {[definitionsName: string]: Schema};
  parameters?: {[parameterName: string]: BodyParameter | QueryParameter};
  responses?: {[responseName: string]: Response};
  security?: {[securityDefinitionName: string]: string[]}[];
  securityDefinitions?: {[securityDefinitionName: string]: Security};
  tags?: Tag[];
}

export interface SwaggerSettings {
  /**
   * The url subpath to access to the documentation.
   */
  path: string;
  /**
   * Swagger file name. By default swagger.json
   */
  fileName?: string;
  /**
   * Hidden documentation. Use this to hide documentation link in the dropdown.
   */
  hidden?: string;
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
   * SwaggerUI options. See (https://github.com/swagger-api/swagger-ui/blob/HEAD/docs/usage/configuration.md)
   */
  options?: SwaggerUIOptions;
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
   *
   */
  operationIdFormat?: string;
  /**
   *
   */
  spec?: SwaggerSpec;
}

export interface ISwaggerSettings extends SwaggerSettings {}
