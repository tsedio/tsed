export interface ConverterSettings {
  /**
   * Converter additional property policy. (see [Converters](/docs/converters.md))
   */
  additionalProperties?: "error" | "accept" | "ignore";
}

export interface IConverterSettings extends ConverterSettings {}
