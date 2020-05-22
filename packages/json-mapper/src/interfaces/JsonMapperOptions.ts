export interface JsonMapperOptions {
  /**
   * Converter additional property policy. (see [Converters](/docs/converters.md))
   *
   */
  additionalProperties?: "error" | "accept" | "ignore";
}
