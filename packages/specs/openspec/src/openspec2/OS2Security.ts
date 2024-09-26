import type {OpenSpecHash} from "../common/OpenSpecHash.js";

export interface OS2SecurityBase {
  /**
   * The type of the security scheme
   */
  type: "basic" | "apiKey" | "oauth2";
  /**
   *
   */
  description?: string;
}

export interface OS2SecurityBasic extends OS2SecurityBase {
  type: "basic";
}

export interface OS2SecurityApiKey extends OS2SecurityBase {
  type: "apiKey";
  name: string;
  in: "query" | "header";
}

export interface OS2SecurityOAuth extends OS2SecurityBase {
  type: "oauth2";
  flow: "accessCode" | "application" | "implicit" | "password";
  /**
   * The available scopes for the OAuth2 security scheme.
   */
  scopes: OpenSpecHash<string>;
}

export interface OS2FlowImplicit extends OS2SecurityOAuth {
  type: "oauth2";
  flow: "implicit";
  authorizationUrl: string;
}

export interface OS2FlowPassword extends OS2SecurityOAuth {
  type: "oauth2";
  flow: "password";
  tokenUrl: string;
}

export interface OS2FlowApplication extends OS2SecurityOAuth {
  type: "oauth2";
  flow: "application";
  tokenUrl: string;
}

export interface OS2FlowAccessCode extends OS2SecurityOAuth {
  type: "oauth2";
  flow: "accessCode";
  tokenUrl: string;
  authorizationUrl: string;
}

export type OS2Security = OS2SecurityBasic | OS2FlowAccessCode | OS2FlowApplication | OS2FlowImplicit | OS2FlowPassword | OS2SecurityApiKey;
