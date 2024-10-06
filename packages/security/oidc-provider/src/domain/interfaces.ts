import type {default as Provider, interactionPolicy} from "oidc-provider";

export type OIDCContext = InstanceType<Provider["OIDCContext"]>;
export type OidcClient = InstanceType<Provider["Client"]>;
export type DefaultPolicy = interactionPolicy.DefaultPolicy;
export type AuthorizationCode = InstanceType<Provider["AuthorizationCode"]>;
export type AccessToken = InstanceType<Provider["AccessToken"]>;
export type ClientCredentials = InstanceType<Provider["ClientCredentials"]>;
export type DeviceCode = InstanceType<Provider["DeviceCode"]>;
export type RefreshToken = InstanceType<Provider["RefreshToken"]>;
export type BackchannelAuthenticationRequest = InstanceType<Provider["BackchannelAuthenticationRequest"]>;
export type Grant = InstanceType<Provider["Grant"]>;
export type OidcInteraction = InstanceType<Provider["Interaction"]>;
