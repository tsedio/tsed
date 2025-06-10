import {PulseConfig} from "@pulsecron/pulse";

export type PulseSettings = PulseConfig & {
  enabled?: boolean;
  disableJobProcessing?: boolean;
  drainJobsBeforeClose?: boolean;
};

declare global {
  namespace TsED {
    interface Configuration {
      pulse?: PulseSettings;
    }
  }
}
