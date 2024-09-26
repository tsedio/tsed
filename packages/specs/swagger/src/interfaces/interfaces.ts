import type {SwaggerSettings} from "./SwaggerSettings.js";

declare global {
  namespace TsED {
    interface Configuration {
      swagger: SwaggerSettings[];
    }
  }
}
