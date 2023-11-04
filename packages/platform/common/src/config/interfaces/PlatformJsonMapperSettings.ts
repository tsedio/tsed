export interface PlatformJsonMapperSettings {
  /**
   * JsonMapper additional property policy. (see [JsonMapper](/docs/json-mapper.md))
   */
  additionalProperties?: boolean;
  /**
   * Disable the unsecure constructor injection when the deserialize function is used (by default: false)
   */
  disableUnsecureConstructor?: boolean;
}

declare global {
  namespace TsED {
    interface Configuration extends Record<string, any> {
      jsonMapper?: PlatformJsonMapperSettings;
    }
  }
}
