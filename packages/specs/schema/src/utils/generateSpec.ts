import {getValue} from "@tsed/core";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {SpecTypes} from "../domain/SpecTypes.js";
import {getSpec, JsonTokenOptions, SpecSerializerOptions} from "./getSpec.js";
import {getSpecTypeFromSpec} from "./getSpecType.js";
import {mapOpenSpec} from "./mapOpenSpec.js";
import {mergeSpec} from "./mergeSpec.js";
import {transformToOS2} from "./transformToOS2.js";

export interface GenerateSpecOptions extends Omit<SpecSerializerOptions, "specType"> {
  tokens: JsonTokenOptions;
  version?: string;
  acceptMimes?: string;
  specVersion?: string;
  spec?: any;
  fileSpec?: any;
  sortPaths?: boolean;
}

/**
 * Generate OpenAPI spec from multiple sources (models, files, conf)
 * @param tokens
 * @param options
 */
export function generateSpec({tokens, ...options}: GenerateSpecOptions): OpenSpec2 | OpenSpec3 {
  const {version = "1.0.0", acceptMimes, fileSpec = {}, specVersion} = options;

  const defaultSpec = mapOpenSpec(getValue(options, "spec", {}), {
    fileSpec,
    version,
    specVersion,
    acceptMimes
  });

  const specType = getSpecTypeFromSpec(defaultSpec);

  let controllersSpec: any = getSpec(tokens, options);
  const spec = mergeSpec(defaultSpec, controllersSpec) as OpenSpec2 | OpenSpec3;

  if (options.sortPaths) {
    spec.paths = Object.fromEntries(Object.entries(spec.paths!).sort(([k1], [k2]) => {
      return k1.localeCompare(k2);
    }));
  }

  if (specType === SpecTypes.SWAGGER) {
    return transformToOS2(spec) as any;
  }

  return spec;
}
