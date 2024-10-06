import type {Account, default as Provider} from "oidc-provider";

import {AccessToken, AuthorizationCode, BackchannelAuthenticationRequest, DeviceCode} from "./interfaces.js";

export interface OidcAccountsMethods {
  findAccount(
    id: string,
    token: AuthorizationCode | AccessToken | DeviceCode | BackchannelAuthenticationRequest | undefined
  ): Promise<Account | undefined>;
}
