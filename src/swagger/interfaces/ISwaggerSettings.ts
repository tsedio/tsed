import {BodyParameter, ExternalDocs, Info, Path, QueryParameter, Response, Schema, Security, Tag} from "swagger-schema-official";

export declare interface IServerSettings {
  swagger: ISwaggerSettings;
}

export declare interface SwaggerUIOptions {
  configUrl?: string;
  url?: string;
  urls?: {url: string; name: string; primaryName?: string}[];
  layout?: string;
  validatorUrl?: any;
  oauth?: any;
  authorize?: any;
}

export interface ISwaggerSettings {
  path: string;
  hidden?: string;
  doc?: string;
  cssPath?: string;
  jsPath?: string;
  options?: SwaggerUIOptions;
  showExplorer?: boolean;
  specPath?: string;
  outFile?: string;
  spec?: {
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
  };
}
