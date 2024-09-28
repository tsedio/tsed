import {OpenSpec2, OpenSpec3} from "@tsed/openspec";

import {SpecTypes} from "../domain/SpecTypes.js";

/**
 * @ignore
 * @param version
 */
export function getSpecType(version: string) {
  return version.startsWith("3.") ? SpecTypes.OPENAPI : SpecTypes.SWAGGER;
}

/**
 * @ignore
 * @param spec
 */
export function getSpecTypeFromSpec(spec: Partial<OpenSpec2 | OpenSpec3>) {
  return "openapi" in spec ? SpecTypes.OPENAPI : SpecTypes.SWAGGER;
}
