import type {Type} from "@tsed/core";

import type {Adapter} from "./Adapter.js";

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
      adapters: AdaptersSettings;
    }
  }
}
