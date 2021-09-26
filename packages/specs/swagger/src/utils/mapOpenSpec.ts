import {getValue, setValue} from "@tsed/core";
import {OpenSpec3, OpenSpecVersions} from "@tsed/openspec";
import {mergeSpec} from "@tsed/schema";
import {mapOpenSpec3} from "./mapOpenSpec3";

/**
 * @ignore
 * @param spec
 * @param fileSpec
 * @param version
 * @param acceptMimes
 * @param specVersion
 */
export function mapOpenSpec(spec: any, {fileSpec, acceptMimes, specVersion, version}: any): Partial<OpenSpec3> {
  specVersion = specVersion || getValue<OpenSpecVersions>(spec, "openapi", "3.0.1");

  const options = {
    specVersion,
    acceptMimes
  };

  spec = mapOpenSpec3(spec, options);
  fileSpec = fileSpec ? mapOpenSpec3(fileSpec, options) : fileSpec;

  spec = mergeSpec(spec, fileSpec);

  setValue(spec, "info.title", getValue(spec, "info.title", "Api documentation"));
  setValue(spec, "info.version", getValue(spec, "info.version", version));

  return spec;
}
