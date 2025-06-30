import {isString} from "@tsed/core";

interface ConvertPathResult {
  path: string | RegExp;
  wildcard?: string;
}

export function convertPath(path: string | RegExp): ConvertPathResult {
  if (isString(path)) {
    const parsed = path.split("/").reduce(
      (options, segment, index) => {
        const isLastSegment = index === path.split("/").length - 1;

        if (isLastSegment && (segment === "*" || segment === "(.*)")) {
          options.wildcard = "*";
          options.path.push("(.*)");

          return options;
        }

        if (segment.startsWith(":") && segment.endsWith("*")) {
          options.wildcard = segment.substring(1, segment.length - 1);
          options.path.push(segment);

          return options;
        }

        if (isLastSegment && segment.startsWith("*")) {
          options.wildcard = segment.substring(1);
          options.path.push(`:${options.wildcard}*`);

          return options;
        }

        if (segment.startsWith("{:") && segment.endsWith("}")) {
          // Handle v5 style parameters like /{param}
          const paramName = segment.substring(2, segment.length - 1);
          options.path.push(`:${paramName}?`);

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

  return {path};
}
