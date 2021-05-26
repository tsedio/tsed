import {Type} from "@tsed/core";
import {ProtocolOptions} from "./ProtocolOptions";

declare global {
  namespace TsED {
    interface Configuration {
      passport: {
        userProperty?: string;
        pauseStream?: string;
        userInfoModel?: Type<any>;
        protocols?: {
          [protocolName: string]: Partial<ProtocolOptions>;
        };
      };
    }
  }
}

export * from "./ProtocolOptions";
export * from "./IProtocol";
export * from "./OnInstall";
export * from "./OnVerify";
