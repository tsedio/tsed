import {ISeqSettings} from "./interfaces/ISeqSettings";

declare module "@tsed/common" {
  interface IServerSettingsOptions {
    seq: ISeqSettings;
  }
}

export * from "./appenders/SeqAppender";
export * from "./SeqModule";
