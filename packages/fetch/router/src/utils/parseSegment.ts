export type ParsedSegment =
  | {type: "static"; value: string}
  | {type: "param"; name: string; optional: boolean}
  | {type: "wildcard"; name: string};

/**
 * Parses one segment of a route pattern.
 *
 * - `*` and `(.*)`: wildcard captured as `*`
 * - `:name*`: wildcard captured as `name`
 * - `:name?` and `{:name}`: optional parameter
 * - `:name`: parameter
 * - anything else: static segment
 */
export function parseSegment(segment: string): ParsedSegment {
  if (segment === "*" || segment === "(.*)") {
    return {type: "wildcard", name: "*"};
  }

  if (segment.charCodeAt(0) === 123 /* { */ && segment.charCodeAt(1) === 58 /* : */ && segment.endsWith("}")) {
    return {type: "param", name: assertName(segment.slice(2, -1)), optional: true};
  }

  if (segment.charCodeAt(0) === 58 /* : */) {
    const last = segment.charAt(segment.length - 1);

    if (last === "*") {
      return {type: "wildcard", name: assertName(segment.slice(1, -1))};
    }

    if (last === "?") {
      return {type: "param", name: assertName(segment.slice(1, -1)), optional: true};
    }

    return {type: "param", name: assertName(segment.slice(1)), optional: false};
  }

  return {type: "static", value: segment};
}

function assertName(name: string): string {
  if (!name) {
    throw new Error("Empty parameter name");
  }

  return name;
}
