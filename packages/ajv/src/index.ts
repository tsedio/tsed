export * from "./errors/AjvValidationError";
export * from "./decorators/useSchema";
export * from "./services/AjvService";
export * from "./services/Ajv";
export * from "./decorators/keyword";
export * from "./interfaces/KeywordMethods";

import {IAjvSettings} from "./interfaces/IAjvSettings";

declare global {
  namespace TsED {
    interface Configuration {
      // @ts-ignore
      ajv?: IAjvSettings;
    }
  }
}
