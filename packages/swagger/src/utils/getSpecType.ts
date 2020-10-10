import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {SpecTypes} from "@tsed/schema";

export function getSpecType(version: string) {
  return version.startsWith("3.") ? SpecTypes.OPENAPI : SpecTypes.SWAGGER;
}

export function getSpecTypeFromSpec(spec: Partial<OpenSpec2 | OpenSpec3>) {
  return "openapi" in spec ? SpecTypes.OPENAPI : SpecTypes.SWAGGER;
}
