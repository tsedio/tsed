export * from "./errors/AjvValidationError";
export * from "./services/AjvService";
export * from "./services/Ajv";
export * from "./decorators/keyword";
export * from "./interfaces/KeywordMethods";
export * from "./decorators/formats";
export * from "./interfaces/FormatsMethods";

import {IAjvSettings} from "./interfaces/IAjvSettings";

declare global {
  namespace TsED {
    interface Configuration {
      // @ts-ignore
      ajv?: IAjvSettings;
    }
  }
}
