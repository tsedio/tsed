import {PlatformFulmineSettings} from "./PlatformFulmineSettings.js";

export * from "./PlatformFulmineSettings.js";

declare global {
  namespace TsED {
    export interface Configuration {
      /**
       * Configuration related to the fulmine.js platform application.
       */
      fulmine: PlatformFulmineSettings;
    }
  }
}
