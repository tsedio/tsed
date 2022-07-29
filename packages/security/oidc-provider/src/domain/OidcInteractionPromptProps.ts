import {UnknownObject} from "oidc-provider";
import {OidcClient} from "./interfaces";

export type OidcInteractionPromptProps<Props = Record<string, any>> = {
  client: OidcClient;
  uid: string;
  grantId: string;
  details: UnknownObject;
  params: Record<string, any>;
} & Props;
