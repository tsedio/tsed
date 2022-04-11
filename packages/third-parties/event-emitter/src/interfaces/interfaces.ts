import {ConstructorOptions} from "eventemitter2";

declare global {
  namespace TsED {
    interface Configuration {
      eventEmitter?: {
        /**
         * Enable Event Emitter. Default `false`.
         */
        enabled?: boolean;
        /**
         * Disable event table displayed in the logger. Default `false`.
         */
        disableSummary?: boolean;
      } & ConstructorOptions;
    }
  }
}
