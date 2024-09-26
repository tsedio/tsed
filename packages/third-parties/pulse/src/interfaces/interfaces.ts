import type {PulseConfig} from "@pulsecron/pulse";

declare global {
  namespace TsED {
    interface Configuration {
      pulse?: {
        /**
         * Enable Pulse jobs. Default false.
         */
        enabled?: boolean;
        disableJobProcessing?: boolean;
        drainJobsBeforeClose?: boolean;
      } & PulseConfig;
    }
  }
}
