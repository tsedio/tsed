import {Type} from "@tsed/core";

import {Adapter} from "./Adapter.js";

export interface AdaptersSettings {
  /**
   * Injectable service to manage database connexion
   */
  Adapter?: Type<Adapter>;
  /**
   *
   */
  lowdbDir?: string;
  /**
   * Use the connection name for the RedisAdapter.
   */
  connectionName?: string;

  [key: string]: any;
}

declare global {
  namespace TsED {
    interface Configuration {
      // @ts-ignore
      adapters: AdaptersSettings;
    }
  }
}
