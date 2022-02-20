import {AgendaConfig} from "agenda";

declare global {
  namespace TsED {
    interface Configuration {
      agenda?: {
        /**
         * Enable Agenda jobs. Default false.
         */
        enabled?: boolean;
      } & AgendaConfig;
    }
  }
}
