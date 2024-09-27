// @ts-ignore
import type {UnknownObject} from "oidc-provider";

import type {OidcClient} from "./interfaces.js";

export type OidcInteractionPromptProps<Props = Record<string, any>> = {
  client: OidcClient;
  uid: string;
  grantId: string;
  details: UnknownObject;
  params: Record<string, any>;
} & Props;
