import type {Type} from "@tsed/core";

export type TokenProvider<T = any> = string | symbol | Type<T> | Function | any;

export interface TokenProviderOpts {
  token?: TokenProvider;
  use: any;
}
