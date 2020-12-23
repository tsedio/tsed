import {PlatformContext} from "@tsed/common";
import Provider, {Account} from "oidc-provider";

export type AuthorizationCode = InstanceType<Provider["AuthorizationCode"]>;
export type AccessToken = InstanceType<Provider["AccessToken"]>;
export type DeviceCode = InstanceType<Provider["DeviceCode"]>;

export interface OidcAccountsMethods {
  findAccount(
    id: string,
    token: AuthorizationCode | AccessToken | DeviceCode | undefined,
    ctx: PlatformContext
  ): Promise<Account | undefined>;
}
