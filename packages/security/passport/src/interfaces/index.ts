import {Type} from "@tsed/core";
import {PassportStatic} from "passport";
import {ProtocolOptions} from "./ProtocolOptions";

declare global {
  namespace TsED {
    interface Configuration {
      passport: {
        userProperty?: string;
        pauseStream?: string;
        disableSession?: boolean;
        userInfoModel?: Type<any> | false;
        module?: PassportStatic;
        protocols?: {
          [protocolName: string]: Partial<ProtocolOptions>;
        };
      };
    }
  }
}

export * from "./ProtocolOptions";
export * from "./ProtocolMethods";
export * from "./OnInstall";
export * from "./OnVerify";
export * from "./BeforeInstall";
