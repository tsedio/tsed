import {SwaggerSettings} from "./ISwaggerSettings";

declare global {
  namespace TsED {
    interface Configuration {
      swagger: SwaggerSettings | SwaggerSettings[];
    }
  }
}

export * from "./ISwaggerPaths";
export * from "./ISwaggerSettings";
export * from "./ISwaggerResponses";
export * from "./OpenApiResponses";
export * from "./OpenApiDefinitions";
