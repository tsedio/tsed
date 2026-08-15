import {isString} from "@tsed/core";

export interface ConvertPathResult {
  path: string | RegExp;
  wildcard?: string;
}

/** Translate Ts.ED/path-to-regexp tokens to Elysia route tokens. */
export function convertPath(path: string | RegExp): ConvertPathResult {
  if (!isString(path)) {
    return {path};
  }

  const segments = path.split("/");
  let wildcard: string | undefined;
  const converted = segments.map((segment, index) => {
    const isLast = index === segments.length - 1;
    if (isLast && (segment === "*" || segment === "(.*)")) {
      wildcard = "*";
      return "*";
    }
    if (isLast && segment.startsWith("*")) {
      wildcard = segment.slice(1);
      return "*";
    }
    if (segment.startsWith(":") && segment.endsWith("*")) {
      wildcard = segment.slice(1, -1);
      return "*";
    }
    if (segment.startsWith("{:") && segment.endsWith("}")) {
      return `:${segment.slice(2, -1)}?`;
    }
    return segment;
  });

  return {path: converted.join("/"), wildcard};
}
