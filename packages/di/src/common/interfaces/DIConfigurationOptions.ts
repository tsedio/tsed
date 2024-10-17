import type {ProviderScope} from "../domain/ProviderScope.js";
import type {DIResolver} from "./DIResolver.js";
import type {ImportTokenProviderOpts} from "./ImportTokenProviderOpts.js";
import type {TokenProvider} from "./TokenProvider.js";

declare global {
  namespace TsED {
    // @ts-ignore
    interface Context {}

    /**
     * Here to allow extension on DIConfiguration base service
     */
    interface DIConfiguration {}

    interface Configuration extends Record<string, any> {
      scopes: {[key: string]: ProviderScope};
      /**
       * Define a list of resolvers (it can be an external DI).
       */
      resolvers: DIResolver[];
      /**
       * Define dependencies to build the provider
       */
      imports: (TokenProvider | ImportTokenProviderOpts)[];
      /**
       * Mount controllers
       */
      mount: Record<string, TokenProvider[]>;
    }
  }
}

export interface DIConfigurationOptions extends TsED.Configuration {}
