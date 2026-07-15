import {getValue} from "@tsed/core";
import {OpenSpec3} from "@tsed/openspec";

import {mapOpenSpecInfo} from "./mapOpenSpecInfo.js";

/**
 * @ignore
 * @param spec
 * @param version
 * @param specVersion
 */
export function mapOpenSpec3(spec: any, {specVersion}: any): Partial<OpenSpec3> {
  const {servers, paths, components, security, tags, externalDocs} = spec;

  return {
    openapi: specVersion,
    info: mapOpenSpecInfo(getValue(spec, "info", {})),
    servers,
    paths,
    components,
    security,
    tags,
    externalDocs
  };
}
