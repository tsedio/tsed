import {Type} from "@tsed/core";
import {IProtocolOptions} from "./IProtocolOptions";

declare global {
  namespace TsED {
    interface Configuration {
      passport: {
        userProperty?: string;
        pauseStream?: string;
        userInfoModel?: Type<any>;
        protocols?: {
          [protocolName: string]: IProtocolOptions;
        };
      };
    }
  }
}

export * from "./IProtocolOptions";
export * from "./IProtocol";
export * from "./OnInstall";
export * from "./OnVerify";
