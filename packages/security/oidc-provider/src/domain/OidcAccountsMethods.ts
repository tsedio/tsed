import {Provider, Account} from "oidc-provider";

export type AuthorizationCode = InstanceType<Provider["AuthorizationCode"]>;
export type AccessToken = InstanceType<Provider["AccessToken"]>;
export type DeviceCode = InstanceType<Provider["DeviceCode"]>;
export type BackchannelAuthenticationRequest = InstanceType<Provider["BackchannelAuthenticationRequest"]>;

export interface OidcAccountsMethods {
  findAccount(
    id: string,
    token: AuthorizationCode | AccessToken | DeviceCode | BackchannelAuthenticationRequest | undefined
  ): Promise<Account | undefined>;
}
