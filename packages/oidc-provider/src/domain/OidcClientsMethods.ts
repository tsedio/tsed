import Provider from "oidc-provider";

export type OidcClient = InstanceType<Provider["Client"]>;

export interface OidcClientsMethods {
  find(id: string): Promise<OidcClient | undefined>;
}
