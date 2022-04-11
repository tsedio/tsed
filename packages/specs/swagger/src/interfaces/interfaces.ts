import {SwaggerSettings} from "./SwaggerSettings";

declare global {
  namespace TsED {
    interface Configuration {
      swagger: SwaggerSettings[];
    }
  }
}
