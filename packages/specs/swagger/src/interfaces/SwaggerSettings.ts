import type {OpenAPI3Settings, OpenApiSettings, Swagger2Settings} from "@tsed/openapi-utils";

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

export type SwaggerOS2Settings = Swagger2Settings;
export type SwaggerOS3Settings = OpenAPI3Settings;
export type SwaggerSettings = OpenApiSettings & {
  showExplorer?: boolean;
  /**
   * SwaggerUI options. See (https://github.com/swagger-api/swagger-ui/blob/HEAD/docs/usage/configuration.md)
   */
  options?: SwaggerUIOptions;
};
