import {BodyParameter, ExternalDocs, Info, Path, QueryParameter, Response, Schema, Security, Tag} from "swagger-schema-official";

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

export interface ISwaggerSettings {
  path: string;
  hidden?: string;
  doc?: string;
  cssPath?: string;
  jsPath?: string;
  viewPath?: string | false;
  options?: SwaggerUIOptions;
  showExplorer?: boolean;
  specPath?: string;
  outFile?: string;
  operationIdFormat?: string;
  spec?: SwaggerSpec;
}
