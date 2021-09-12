export interface OpenSpecContact {
  /**
   * The identifying name of the contact person/organization.
   */
  name?: string;
  /**
   * The email address of the contact person/organization. MUST be in the format of an email address.
   */
  email?: string;
  /**
   * The URL pointing to the contact information. MUST be in the format of a URL.
   */
  url?: string;
}

export interface OpenSpecLicense {
  /**
   * The license name used for the API.
   */
  name: string;
  /**
   * A URL to the license used for the API. MUST be in the format of a URL.
   */
  url?: string;
}

export interface OpenSpecInfo {
  /**
   * The title of the application.
   */
  title: string;
  /**
   * The version of the OpenAPI document (which is distinct from the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#oasVersion) version or the API implementation version).
   */
  version: string;
  /**
   * A short description of the application. [CommonMark syntax](http://spec.commonmark.org/) MAY be used for rich text representation.
   */
  description?: string;
  /**
   * A URL to the Terms of Service for the API. MUST be in the format of a URL.
   */
  termsOfService?: string;
  /**
   * The contact information for the exposed API.
   */
  contact?: OpenSpecContact;
  /**
   * The license information for the exposed API.
   */
  license?: OpenSpecLicense;
}
