import {LoggerSeqSettings} from "./LoggerSeqSettings";

declare global {
  namespace TsED {
    interface Configuration {
      seq: LoggerSeqSettings;
    }
  }
}

export * from "./LoggerSeqSettings";
