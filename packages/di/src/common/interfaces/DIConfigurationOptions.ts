import type {ImportTokenProviderOpts} from "./ImportTokenProviderOpts.js";
import type {ProviderScope} from "../domain/ProviderScope.js";
import type {TokenProvider} from "./TokenProvider.js";

declare global {
  namespace TsED {
    // @ts-ignore
    interface Context {}

    interface Configuration extends Record<string, any> {
      scopes: {[key: string]: ProviderScope};
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
