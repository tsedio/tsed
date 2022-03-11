import fs from "fs";
import {getValue} from "@tsed/core";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {mapOpenSpec} from "./mapOpenSpec";
import {getSpec, JsonTokenOptions, SpecSerializerOptions} from "./getSpec";
import {getSpecTypeFromSpec} from "./getSpecType";
import {mergeSpec} from "./mergeSpec";

export interface GenerateSpecOptions extends Omit<SpecSerializerOptions, "specType"> {
  tokens: JsonTokenOptions;
  version?: string;
  acceptMimes?: string;
  specPath?: string;
  specVersion?: string;
  spec?: any;
}

function readSpec(path: string) {
  if (fs.existsSync(path)) {
    try {
      const json = fs.readFileSync(path, {encoding: "utf8"});
      /* istanbul ignore else */
      if (json !== "") {
        return JSON.parse(json);
      }
    } catch (e) {}
  }

  return {};
}

/**
 * Generate OpenAPI spec from multiple sources (models, files, conf)
 * @param tokens
 * @param options
 */
export function generateSpec({tokens, ...options}: GenerateSpecOptions): OpenSpec2 | OpenSpec3 {
  const {version = "1.0.0", acceptMimes, specPath, specVersion} = options;
  const fileSpec: Partial<OpenSpec2 | OpenSpec3> = specPath ? readSpec(specPath) : {};

  const defaultSpec = mapOpenSpec(getValue(options, "spec", {}), {
    fileSpec,
    version,
    specVersion,
    acceptMimes
  });

  return mergeSpec(
    defaultSpec,
    getSpec(tokens, {
      ...options,
      specType: getSpecTypeFromSpec(defaultSpec)
    })
  ) as any;
}
