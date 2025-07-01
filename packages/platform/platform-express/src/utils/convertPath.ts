import {isString} from "@tsed/core";

type Framework = "v4" | "v5";

interface ConvertPathResult {
  path: string | RegExp;
  wildcard?: string;
}

/**
 * Converts a path to v4 format
 */
function convertPathToV4(path: string): ConvertPathResult {
  const segments = path.split("/");

  const parsed = segments.reduce(
    (options, segment, index) => {
      const isLastSegment = index === segments.length - 1;

      if (isLastSegment && (segment === "*" || segment === "(.*)")) {
        options.wildcard = "*";
        options.path.push("*");
        return options;
      }

      if (isLastSegment && segment.startsWith("*")) {
        options.wildcard = segment.substring(1);
        options.path.push("*");

        return options;
      }

      if (segment.startsWith(":") && segment.endsWith("*")) {
        options.wildcard = segment.substring(1, segment.length - 1);

        options.path.push("*");
        return options;
      }

      if (segment.startsWith("{")) {
        // Handle v5 style parameters like /{param}
        const paramName = segment.substring(1, segment.length - 1);
        options.path.push(`${paramName}?`);

        return options;
      }

      options.path.push(segment);

      return options;
    },
    {path: [], wildcard: undefined} as {path: string[]; wildcard?: string}
  );

  return {
    path: parsed.path.join("/"),
    wildcard: parsed.wildcard
  };
}

/**
 * Converts a path to v5 format
 */
function convertPathToV5(path: string): ConvertPathResult {
  const segments = path.split("/");

  const parsed = segments.reduce(
    (options, segment, index) => {
      const isLastSegment = index === segments.length - 1;

      if (isLastSegment && (segment === "*" || segment === "(.*)")) {
        options.wildcard = "*";
        options.path.push("{*wildcard}");

        return options;
      }

      if (isLastSegment && segment.startsWith("*")) {
        options.wildcard = segment.substring(1);
        options.path.push(segment);

        return options;
      }

      if (segment.startsWith(":")) {
        if (segment.endsWith("?")) {
          options.path.push(`{:${segment.substring(1, segment.length - 1)}}`);

          return options;
        }

        if (isLastSegment && segment.endsWith("*")) {
          options.wildcard = segment.substring(1, segment.length - 1);
          options.path.push(`{*${options.wildcard}}`);

          return options;
        }
      }

      if (isLastSegment && segment.startsWith("{*")) {
        // Handle v5 style parameters like /{param}
        options.wildcard = segment.substring(2, segment.length - 1);
      }

      options.path.push(segment);

      return options;
    },
    {path: [], wildcard: undefined} as {path: string[]; wildcard?: string}
  );

  return {
    path: parsed.path.join("/"),
    wildcard: parsed.wildcard
  };
}

/**
 * Converts a path between v4 and v5 formats
 */
export function convertPath(path: string | RegExp, framework: Framework): ConvertPathResult {
  if (isString(path)) {
    if (framework === "v4") {
      return convertPathToV4(path);
    } else {
      return convertPathToV5(path);
    }
  }
  return {path};
}
