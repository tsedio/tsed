export * from "./errors/AjvValidationError";
export * from "./services/AjvService";
import {IAjvSettings} from "./interfaces/IAjvSettings";

declare global {
  namespace TsED {
    interface Configuration {
      ajv?: IAjvSettings;
    }
  }
}
