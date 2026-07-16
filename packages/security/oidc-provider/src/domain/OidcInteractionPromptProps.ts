import {OidcClient} from "./interfaces.js";
import type {UnknownObject} from "oidc-provider";

export type OidcInteractionPromptProps<Props = Record<string, any>> = {
  client: OidcClient;
  uid: string;
  grantId: string;
  details: UnknownObject;
  params: Record<string, any>;
} & Props;
