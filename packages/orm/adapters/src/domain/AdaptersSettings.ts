import {Adapter} from "./Adapter.js";
import {Type} from "@tsed/core";

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
