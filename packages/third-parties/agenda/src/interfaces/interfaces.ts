import {AgendaConfig} from "agenda";

export type AgendaSettings = AgendaConfig & {
  enabled?: boolean;
  disableJobProcessing?: boolean;
  drainJobsBeforeClose?: boolean;
};

declare global {
  namespace TsED {
    interface Configuration {
      agenda?: AgendaSettings;
    }
  }
}
