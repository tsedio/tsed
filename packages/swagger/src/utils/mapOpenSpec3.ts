import {getValue} from "@tsed/core";
import {OpenSpec3} from "@tsed/openspec";
import {mapOpenSpecInfo} from "./mapOpenSpecInfo";

export function mapOpenSpec3(spec: any, {version, specVersion}: any): Partial<OpenSpec3> {
  const {servers, paths, components, security, tags, externalDocs} = spec;

  return {
    openapi: specVersion,
    info: mapOpenSpecInfo(getValue(spec, "info", {}), version),
    servers,
    paths,
    components,
    security,
    tags,
    externalDocs
  };
}
