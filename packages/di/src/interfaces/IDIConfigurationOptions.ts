import {IDIResolver} from "./IDIResolver";
import {ProviderScope} from "./ProviderScope";

declare global {
  namespace TsED {
    interface Configuration {}
  }
}

export interface IDIConfigurationOptions extends TsED.Configuration {
  scopes?: {[key: string]: ProviderScope};
  resolvers?: IDIResolver[];

  [key: string]: any;
}
