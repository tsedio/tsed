import {getValue} from "@tsed/core";
import {OpenSpec2, OpenSpec3} from "@tsed/openspec";
import {SpecTypes} from "../domain/SpecTypes";
import {getSpec, JsonTokenOptions, SpecSerializerOptions} from "./getSpec";
import {getSpecTypeFromSpec} from "./getSpecType";
import {mapOpenSpec} from "./mapOpenSpec";
import {mergeSpec} from "./mergeSpec";
import {transformToOS2} from "./transformToOS2";

export interface GenerateSpecOptions extends Omit<SpecSerializerOptions, "specType"> {
  tokens: JsonTokenOptions;
  version?: string;
  acceptMimes?: string;
  specPath?: string;
  specVersion?: string;
  spec?: any;
}
/* node_env:start */
async function readSpec(path: string) {
  const {default: fs} = await import("fs-extra");
  if (fs.existsSync(path)) {
    try {
      return await fs.readJSON(path, {encoding: "utf8"});
    } catch (e) {}
  }

  /* istanbul ignore next */
  return {};
}
/* node_env:end */
/**
 * Generate OpenAPI spec from multiple sources (models, files, conf)
 * @param tokens
 * @param options
 */
export async function generateSpec({tokens, ...options}: GenerateSpecOptions): Promise<OpenSpec2 | OpenSpec3> {
  const {version = "1.0.0", acceptMimes, specPath, specVersion} = options;
  const fileSpec: Partial<OpenSpec2 | OpenSpec3> = /* node_env:start */ specPath ? await readSpec(specPath) : /* node_env:end */ {};

  const defaultSpec = mapOpenSpec(getValue(options, "spec", {}), {
    fileSpec,
    version,
    specVersion,
    acceptMimes
  });

  const specType = getSpecTypeFromSpec(defaultSpec);

  let controllersSpec: any = getSpec(tokens, options);
  const spec: any = mergeSpec(defaultSpec, controllersSpec);

  if (specType === SpecTypes.SWAGGER) {
    return transformToOS2(spec) as any;
  }

  return spec;
}
