import {readFileSync, statSync} from "fs";

/**
 * CLI parameter definition consumed by {@link parseArgs}.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type Param = {
  shorthand?: string;
  description?: string;
  required?: boolean | string | undefined;
} & ({value?: "boolean"} | {value: "number"} | {value: "string"} | {value: {[key: number]: string}});

/**
 * Map of CLI parameter definitions.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type Params = {[name: string]: Param};

type InferReturnType<T extends Params> = {
  [name in keyof T]:
    | (T[name]["value"] extends "number"
        ? number
        : T[name]["value"] extends "string"
          ? string
          : T[name]["value"] extends {[key: number]: string}
            ? T[name]["value"][number]
            : T[name]["value"] extends never
              ? boolean
              : boolean)
    | (T[name]["required"] extends string | true ? never : undefined);
};

/**
 * Lightweight CLI arg parser honoring shorthands, type coercion, and required flags.
 *
 * @param params Parameter metadata map.
 * @param args Argument vector (usually `process.argv`).
 * @param help Optional help flag description; when provided, `-h/--help` prints usage.
 * @module platform/mcp
 * @since 8.17.0
 */
export function parseArgs<T extends Params>(params: T, args: string[], help?: boolean | string): InferReturnType<T> {
  const result: Record<string, string | number | boolean> = {};

  if (help) {
    let index = args.indexOf("--help");

    if (index === -1) {
      index = args.indexOf("-h");
    }

    if (index !== -1) {
      printParams({
        ...params,
        help: {
          shorthand: "h",
          description: typeof help === "string" ? help : "Display this message :)"
        }
      });

      process.exit(0);
    }
  }

  for (const name in params) {
    const {shorthand, required, value} = params[name];
    let index = args.indexOf("--" + name);

    if (index === -1 && shorthand) {
      index = args.indexOf("-" + shorthand);
    }

    if (index === -1) {
      if (required || required === "") {
        throw new Error(typeof required === "string" && required !== "" ? required : `Missing required argument ${name}`);
      }

      result[name] = false;

      continue;
    }

    if (value) {
      const val = args[index + 1];

      if (val === undefined) {
        throw new Error(`Expected a value for argument ${name}`);
      }

      if (value === "number") {
        const asNumber = Number(val);

        if (isNaN(asNumber)) {
          throw new Error(`Value of argument ${name} must be a valid number`);
        }

        result[name] = asNumber;

        continue;
      }

      if (Array.isArray(value) && !value.includes(val)) {
        throw new Error(`Value of argument ${name} must be one of ${value}`);
      }

      result[name] = val;
    } else {
      result[name] = true;
    }
  }

  return result as any;
}

/**
 * Parses inline JSON or reads JSON from a file path (auto-detected by stat).
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export function parseOrReadJSON(jsonOrPath: string): unknown {
  jsonOrPath = jsonOrPath.trim();

  if (jsonOrPath.length < 255 && statSync(jsonOrPath, {throwIfNoEntry: false})?.isFile()) {
    jsonOrPath = readFileSync(jsonOrPath, "utf-8");
  }

  return JSON.parse(jsonOrPath);
}

/**
 * Reads piped stdin into a UTF-8 string.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export function readPipe(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let buf = "";

    process.stdin
      .setEncoding("utf-8")
      .on("end", () => resolve(buf))
      .on("error", reject)
      .on("readable", () => {
        let chunk: string | null;

        while ((chunk = process.stdin.read()) != null) {
          buf += chunk;
        }
      });
  });
}

/**
 * Prints a simple help table describing available CLI parameters.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export function printParams(params: Record<string, Param>): void {
  const longest = Object.keys(params).reduce((l, c) => (c.length > l ? c.length : l), 5);

  const header = "Name " + " ".repeat(longest - 2) + "Short Description";

  console.log(header);

  for (const name in params) {
    let {shorthand, description} = params[name];

    if (shorthand) {
      shorthand = " -" + shorthand;
    } else {
      shorthand = "   ";
    }

    if (description) {
      description = "    " + description;
    } else {
      description = "";
    }

    console.log("--" + name + " ".repeat(longest - name.length) + shorthand + description);
  }
}
