import {Type} from "@tsed/core";
import {Adapter} from "./Adapter";

export interface AdaptersSettings {
  /**
   * Injectable service to manage database connexion
   */
  Adapter?: Type<Adapter>;
  /**
   *
   */
  lowdbDir?: string;

  [key: string]: any;
}

declare global {
  namespace TsED {
    interface AdaptersOptions extends AdaptersSettings {}

    interface Configuration {
      adapters: AdaptersSettings;
    }
  }
}
