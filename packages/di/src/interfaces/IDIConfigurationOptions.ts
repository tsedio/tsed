import {ProviderScope} from "./ProviderScope";

declare global {
  namespace TsED {
    interface Configuration {}
  }
}

export interface IDIConfigurationOptions extends TsED.Configuration {
  scopes?: {[key: string]: ProviderScope};

  [key: string]: any;
}
