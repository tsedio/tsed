import {IDIResolver} from "./IDIResolver";
import {ProviderScope} from "./ProviderScope";
import {TokenProvider} from "./TokenProvider";

declare global {
  namespace TsED {
    interface Configuration {
      scopes: {[key: string]: ProviderScope};
      /**
       * Define a list of resolvers (it can be an external DI).
       */
      resolvers: IDIResolver[];
      /**
       * Define dependencies to build the provider
       */
      imports: TokenProvider[];

      [key: string]: any;
    }
  }
}

export interface IDIConfigurationOptions extends TsED.Configuration {}
