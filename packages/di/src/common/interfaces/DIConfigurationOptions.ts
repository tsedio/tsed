import type {ProviderScope} from "../domain/ProviderScope";
import type {DIResolver} from "./DIResolver";
import type {TokenProvider} from "./TokenProvider";
import {TokenProviderOpts} from "./TokenProvider";

declare global {
  namespace TsED {
    // @ts-ignore
    interface Context {}

    interface Configuration extends Record<string, any> {
      scopes: {[key: string]: ProviderScope};
      /**
       * Define a list of resolvers (it can be an external DI).
       */
      resolvers: DIResolver[];
      /**
       * Define dependencies to build the provider
       */
      imports: (TokenProvider | TokenProviderOpts)[];
      /**
       * Mount controllers
       */
      mount: Record<string, TokenProvider[]>;
      /**
       * Append children routes before the controller routes itself
       *
       * Will default to true in next major version
       */
      appendChildrenRoutesFirst: boolean;
    }
  }
}

export interface DIConfigurationOptions extends TsED.Configuration {}
