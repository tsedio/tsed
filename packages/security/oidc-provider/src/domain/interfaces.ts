// @ts-ignore
import type {interactionPolicy, default as Provider} from "oidc-provider";

export type OidcClient = InstanceType<Provider["Client"]>;
export type DefaultPolicy = interactionPolicy.DefaultPolicy;
