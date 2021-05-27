import {AgendaConfig} from "agenda";

declare global {
  namespace TsED {
    interface Configuration {
      agenda?: {
        /**
         * Enable Agenda jobs. Default false.
         */
        enabled: boolean;
      } & AgendaConfig;
    }
  }
}

export * from "./AgendaModule";
export * from "./constants";
export * from "./decorators";
export * from "./interfaces/AgendaStore";
export * from "./services/AgendaFactory";
