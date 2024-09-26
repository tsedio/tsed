import type {AgendaConfig} from "agenda";

declare global {
  namespace TsED {
    interface Configuration {
      agenda?: {
        /**
         * Enable Agenda jobs. Default false.
         */
        enabled?: boolean;
        disableJobProcessing?: boolean;
        drainJobsBeforeClose?: boolean;
      } & AgendaConfig;
    }
  }
}
