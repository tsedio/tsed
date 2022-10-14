import {interactionPolicy} from "oidc-provider";

export interface OidcInteractionOptions {
  name: string;
  requestable?: boolean | undefined;
  priority?: number;
  checks?: interactionPolicy.Check[];
}
