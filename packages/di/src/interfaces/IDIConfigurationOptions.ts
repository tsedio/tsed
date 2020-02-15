import {IDIResolver} from "./IDIResolver";
import {ProviderScope} from "./ProviderScope";

declare global {
  namespace TsED {
    interface Configuration {
      scopes?: {[key: string]: ProviderScope};
      resolvers?: IDIResolver[];

      [key: string]: any;
    }
  }
}

export interface IDIConfigurationOptions extends TsED.Configuration {}
