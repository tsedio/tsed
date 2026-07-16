import {AccessToken, AuthorizationCode, BackchannelAuthenticationRequest, DeviceCode} from "./interfaces.js";
import type {Account, default as Provider} from "oidc-provider";

export interface OidcAccountsMethods {
  findAccount(
    id: string,
    token: AuthorizationCode | AccessToken | DeviceCode | BackchannelAuthenticationRequest | undefined
  ): Promise<Account | undefined>;
}
