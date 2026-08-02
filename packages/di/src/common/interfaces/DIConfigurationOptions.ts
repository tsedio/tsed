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
       * Defer construction of synchronous singleton providers without lifecycle hooks until first use.
       * @default false
       */
      lazyProviders?: boolean;
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
