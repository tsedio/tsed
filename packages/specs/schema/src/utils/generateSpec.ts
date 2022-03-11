import fs from "fs-extra";
import {getValue} from "@tsed/core";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {mapOpenSpec} from "./mapOpenSpec";
import {getSpec, JsonTokenOptions, SpecSerializerOptions} from "./getSpec";
import {getSpecTypeFromSpec} from "./getSpecType";
import {mergeSpec} from "./mergeSpec";
// @ts-ignore
import Converter from "api-spec-converter";
import {SpecTypes} from "../domain/SpecTypes";

export interface GenerateSpecOptions extends Omit<SpecSerializerOptions, "specType"> {
  tokens: JsonTokenOptions;
  version?: string;
  acceptMimes?: string;
  specPath?: string;
  specVersion?: string;
  spec?: any;
}

async function readSpec(path: string) {
  if (fs.existsSync(path)) {
    try {
      return await fs.readJSON(path, {encoding: "utf8"});
    } catch (e) {}
  }

  /* istanbul ignore next */
  return {};
}

/**
 * Generate OpenAPI spec from multiple sources (models, files, conf)
 * @param tokens
 * @param options
 */
export async function generateSpec({tokens, ...options}: GenerateSpecOptions): Promise<OpenSpec2 | OpenSpec3> {
  const {version = "1.0.0", acceptMimes, specPath, specVersion} = options;
  const fileSpec: Partial<OpenSpec2 | OpenSpec3> = specPath ? await readSpec(specPath) : {};

  const defaultSpec = mapOpenSpec(getValue(options, "spec", {}), {
    fileSpec,
    version,
    specVersion,
    acceptMimes
  });

  const specType = getSpecTypeFromSpec(defaultSpec);

  let controllersSpec = getSpec(tokens, options);

  if (specType === SpecTypes.SWAGGER) {
    const {spec} = await Converter.convert({
      from: "openapi_3",
      to: "swagger_2",
      source: {
        ...controllersSpec,
        openapi: "3.0.1"
      }
    });
    controllersSpec = spec;
    delete (controllersSpec as any)["x-components"];
  }

  return mergeSpec(defaultSpec, controllersSpec) as any;
}
