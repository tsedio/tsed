import {type AgendaOptions} from "agenda";

type CommonSettings = {
  disableJobProcessing?: boolean;
  drainJobsBeforeClose?: boolean;
} & AgendaOptions;

export type AgendaSettings =
  | ({enabled: false} & Partial<CommonSettings>)
  | ({
      enabled?: true;
    } & CommonSettings);

declare global {
  namespace TsED {
    interface Configuration {
      agenda?: AgendaSettings;
    }
  }
}
