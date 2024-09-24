import type {AbstractType, Type} from "@tsed/core";

import type {TokenProvider} from "./TokenProvider.js";

export type UseImportTokenProviderOpts = {
  token: TokenProvider;
  use: unknown;
};

export type UseClassImportTokenProviderOpts = {
  token: TokenProvider;
  useClass: Type | AbstractType<any>;
};

export type UseFactoryImportTokenProviderOpts = {
  token: TokenProvider;
  useFactory: (...args: unknown[]) => unknown;
};

export type UseAsyncFactoryImportTokenProviderOpts = {
  token: TokenProvider;
  useAsyncFactory: (...args: unknown[]) => Promise<unknown>;
};

export type ImportTokenProviderOpts =
  | UseImportTokenProviderOpts
  | UseClassImportTokenProviderOpts
  | UseFactoryImportTokenProviderOpts
  | UseAsyncFactoryImportTokenProviderOpts;
