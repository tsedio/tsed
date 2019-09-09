import {ISeqSettings} from "./ISeqSettings";

declare global {
  namespace TsED {
    interface Configuration {
      seq: ISeqSettings;
    }
  }
}

export * from "./ISeqSettings";
