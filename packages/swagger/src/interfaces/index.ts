import {ISwaggerSettings} from "./ISwaggerSettings";

declare global {
  namespace TsED {
    interface Configuration {
      swagger: ISwaggerSettings | ISwaggerSettings[];
    }
  }
}

export * from "./ISwaggerPaths";
export * from "./ISwaggerSettings";
export * from "./ISwaggerResponses";
export * from "./OpenApiResponses";
export * from "./OpenApiDefinitions";
