import {IAjvSettings} from "./IAjvSettings";

declare global {
  namespace TsED {
    interface Configuration {
      // @ts-ignore
      ajv?: IAjvSettings;
    }
  }
}
