import {getValue, uniq} from "@tsed/core";
import {OpenSpec2} from "@tsed/openspec";
import {mapOpenSpecInfo} from "./mapOpenSpecInfo";

export function mapOpenSpec2(
  spec: Partial<OpenSpec2>,
  {version, specVersion, acceptMimes = ["application/json"]}: any
): Partial<OpenSpec2> {
  const {
    paths,
    security,
    tags,
    host,
    basePath,
    schemes,
    consumes = [],
    produces = ["application/json"],
    definitions,
    parameters,
    responses,
    securityDefinitions,
    externalDocs
  } = spec;

  return {
    swagger: specVersion,
    consumes: uniq([...acceptMimes, ...consumes]),
    produces: uniq<string>([...produces]),
    info: mapOpenSpecInfo(getValue(spec, "info", {}), version),
    paths,
    host,
    basePath,
    schemes,
    definitions,
    parameters,
    responses,
    security,
    securityDefinitions,
    tags,
    externalDocs
  };
}
