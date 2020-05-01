export * from "./errors/AjvValidationError";
export * from "./decorators/useSchema";
export * from "./pipes/AjvValidationPipe";
export * from "./pipes/AjvErrorFormatterPipe";
export * from "./services/Ajv";

import {IAjvSettings} from "./interfaces/IAjvSettings";

declare global {
  namespace TsED {
    interface Configuration {
      // @ts-ignore
      ajv?: IAjvSettings;
    }
  }
}
