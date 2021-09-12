export interface OpenSpecExternalDocs {
  /**
   * The URL for the target documentation. Value MUST be in the format of a URL.
   */
  url: string;
  /**
   * A short description of the target documentation. [CommonMark syntax](http://spec.commonmark.org/) MAY be used for rich text representation.
   */
  description?: string;
}
