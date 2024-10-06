import type {CanBePromise, interactionPolicy, KoaContextWithOIDC, UnknownObject} from "oidc-provider";
export interface OidcInteractionOptions {
  name: string;
  requestable?: boolean | undefined;
  priority?: number;
  details?: (ctx: KoaContextWithOIDC) => CanBePromise<UnknownObject>;
  checks?: interactionPolicy.Check[];
}
