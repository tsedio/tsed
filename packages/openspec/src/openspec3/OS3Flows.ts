export interface OS3Flow {
  /**
   * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.
   */
  refreshUrl?: string;
  /**
   * The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it.
   */
  scopes: {[key: string]: string};
}

export interface OS3FlowImplicit extends OS3Flow {
  /**
   * The authorization URL to be used for this flow. This MUST be in the form of a URL.
   */
  authorizationUrl: string;
}

export interface OS3FlowPassword extends OS3Flow {
  /**
   * The token URL to be used for this flow. This MUST be in the form of a URL.
   */
  tokenUrl: string;
}

export interface OS3FlowClientCredentials {
  /**
   * The token URL to be used for this flow. This MUST be in the form of a URL.
   */
  tokenUrl: string;
}

export interface OS3FlowAuthorizationCode {
  /**
   * The authorization URL to be used for this flow. This MUST be in the form of a URL.
   */
  authorizationUrl: string;
  /**
   * The token URL to be used for this flow. This MUST be in the form of a URL.
   */
  tokenUrl: string;
}

export interface OS3Flows {
  implicit?: OS3FlowImplicit;
  password?: OS3FlowPassword;
  clientCredentials?: OS3FlowClientCredentials;
  authorizationCode?: OS3FlowAuthorizationCode;
}
