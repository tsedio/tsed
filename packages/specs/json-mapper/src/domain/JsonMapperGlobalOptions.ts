export interface JsonMapperGlobalOptions {
  /**
   * JsonMapper additional property policy. (see [JsonMapper](/docs/json-mapper.md))
   */
  additionalProperties?: boolean;
  /**
   * Disable the unsecure constructor injection when the deserialize function is used (by default: false)
   */
  disableUnsecureConstructor?: boolean;
  /**
   * Enable strict Groups configuration when the `options.groups` is undefined. (by default: false)
   */
  strictGroups?: boolean;
}
