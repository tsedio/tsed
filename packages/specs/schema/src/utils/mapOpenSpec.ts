import {getValue, setValue} from "@tsed/core";
import {OpenSpec2, OpenSpec3, OpenSpecVersions} from "@tsed/openspec";

import {SpecTypes} from "../domain/SpecTypes.js";
import {getSpecType} from "./getSpecType.js";
import {mapOpenSpec2} from "./mapOpenSpec2.js";
import {mapOpenSpec3} from "./mapOpenSpec3.js";
import {mergeSpec} from "./mergeSpec.js";

/**
 * @ignore
 * @param spec
 * @param fileSpec
 * @param version
 * @param acceptMimes
 * @param specVersion
 */
export function mapOpenSpec(spec: any, {fileSpec, acceptMimes, specVersion, version}: any): Partial<OpenSpec2 | OpenSpec3> {
  specVersion = specVersion || getValue<OpenSpecVersions>(spec, "openapi", getValue(spec, "swagger", "2.0"));

  const options = {
    specVersion,
    acceptMimes
  };

  switch (getSpecType(specVersion)) {
    case SpecTypes.OPENAPI:
      spec = mapOpenSpec3(spec, options);
      fileSpec = fileSpec ? mapOpenSpec3(fileSpec, options) : fileSpec;
      break;
    default:
    case SpecTypes.SWAGGER:
      spec = mapOpenSpec2(spec, options);
      fileSpec = fileSpec ? mapOpenSpec2(fileSpec, options) : fileSpec;
      break;
  }

  spec = mergeSpec(spec, fileSpec);

  setValue(spec, "info.title", getValue(spec, "info.title", "Api documentation"));
  setValue(spec, "info.version", getValue(spec, "info.version", version));

  return spec;
}
