#!/usr/bin/env node
import {mkdirSync, writeFileSync} from "fs";
import {dirname} from "path";
import {fileURLToPath} from "url";

import {jsonSchemaToZod} from "./jsonSchemaToZod.js";
import {JsonSchema, ZodVersion} from "./Types.js";
import {parseArgs, parseOrReadJSON, readPipe} from "./utils/cliTools.js";

const params = {
  input: {
    shorthand: "i",
    value: "string",
    required: process.stdin.isTTY && "input is required when no JSON or file path is piped",
    description: "JSON or a source file path. Required if no data is piped."
  },
  output: {
    shorthand: "o",
    value: "string",
    description: "A file path to write to. If not supplied stdout will be used."
  },
  name: {
    shorthand: "n",
    value: "string",
    description: "The name of the schema in the output."
  },
  depth: {
    shorthand: "d",
    value: "number",
    description: "Maximum depth of recursion before falling back to z.any(). Defaults to 0."
  },
  module: {
    shorthand: "m",
    value: ["esm", "cjs", "none"],
    description: "Module syntax; 'esm', 'cjs' or 'none'. Defaults to 'esm'."
  },
  type: {
    shorthand: "t",
    value: "string",
    description: "The name of the (optional) inferred type export."
  },
  noImport: {
    shorthand: "ni",
    description: "Removes the `import { z } from 'zod';` or equivalent from the output."
  },
  withJsdocs: {
    shorthand: "wj",
    description: "Generate jsdocs off of the description property."
  },
  zodVersion: {
    shorthand: "zv",
    value: "number",
    description: "Target Zod version: 3 or 4. Defaults to 4."
  }
} as const;

/**
 * Entry point for the `json-schema-to-zod` CLI that converts JSON Schema files into Zod source code.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
async function main() {
  const args = parseArgs(params, process.argv, true);
  const input = args.input || (await readPipe());
  const jsonSchema = parseOrReadJSON(input);
  const zodVersion = (args.zodVersion === 3 ? 3 : 4) as ZodVersion;
  const zodSchema = jsonSchemaToZod(jsonSchema as JsonSchema, {
    name: args.name,
    depth: args.depth,
    module: args.module || "esm",
    noImport: args.noImport,
    type: args.type,
    withJsdocs: args.withJsdocs,
    zodVersion
  });

  if (args.output) {
    mkdirSync(dirname(args.output), {recursive: true});
    writeFileSync(args.output, zodSchema);
  } else {
    console.log(zodSchema);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  void main();
}
