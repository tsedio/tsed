// @ts-ignore
import type {default as Provider, Account} from "oidc-provider";
import {AccessToken, AuthorizationCode, BackchannelAuthenticationRequest, DeviceCode} from "./interfaces";

export interface OidcAccountsMethods {
  findAccount(
    id: string,
    token: AuthorizationCode | AccessToken | DeviceCode | BackchannelAuthenticationRequest | undefined
  ): Promise<Account | undefined>;
}
