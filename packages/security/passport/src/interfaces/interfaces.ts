import type {Type} from "@tsed/core";
import type {PassportStatic} from "passport";

import type {ProtocolOptions} from "./ProtocolOptions.js";

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
