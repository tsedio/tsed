import type {JsonMapperGlobalOptions} from "./JsonMapperGlobalOptions.js";

/**
 * Default runtime settings applied by the JSON mapper pipeline.
 */
export const JsonMapperSettings: JsonMapperGlobalOptions = {
  disableUnsecureConstructor: true,
  additionalProperties: false,
  strictGroups: false
};
