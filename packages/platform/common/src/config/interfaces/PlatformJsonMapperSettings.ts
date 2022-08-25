export interface PlatformJsonMapperSettings {
  /**
   * JsonMapper additional property policy. (see [JsonMapper](/docs/json-mapper.md))
   */
  additionalProperties?: "error" | "accept" | "ignore" | boolean;
  /**
   * Disable the unsecure constructor injection when the deserialize function is used (by default: false)
   */
  disableUnsecureConstructor?: boolean;
}
