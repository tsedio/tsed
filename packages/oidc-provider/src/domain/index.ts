import Provider, {interactionPolicy} from "oidc-provider";

export * from "./OidcAccountsMethods";
export * from "./OidcInteraction";
export * from "./OidcInteractionMethods";
export * from "./OidcInteractionOptions";
export * from "./OidcSettings";

export type OidcClient = InstanceType<Provider["Client"]>;
export type DefaultPolicy = interactionPolicy.DefaultPolicy;
