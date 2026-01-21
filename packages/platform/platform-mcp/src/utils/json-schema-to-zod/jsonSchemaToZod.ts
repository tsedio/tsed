import {parseSchema} from "./parsers/parseSchema.js";
import {JsonSchema, Options} from "./Types.js";
import {expandJsdocs} from "./utils/jsdocs.js";

/**
 * Generates Zod code from a JSON Schema, optionally targeting specific module systems and versions.
 *
 * @param schema JSON Schema definition to translate.
 * @param options Generation options such as module format, naming, and version targets.
 * @returns A string of executable JavaScript/TypeScript that constructs an equivalent Zod schema.
 * @module platform/mcp
 * @since 8.17.0
 */
export const jsonSchemaToZod = (schema: JsonSchema, {module, name, type, noImport, zodVersion = 4, ...rest}: Options = {}): string => {
  if (type && (!name || module !== "esm")) {
    throw new Error("Option `type` requires `name` to be set and `module` to be `esm`");
  }

  let result = parseSchema(schema, {
    module,
    name,
    path: [],
    seen: new Map(),
    zodVersion,
    ...rest
  });

  const jsdocs = rest.withJsdocs && typeof schema !== "boolean" && schema.description ? expandJsdocs(schema.description) : "";

  if (module === "cjs") {
    result = `${jsdocs}module.exports = ${name ? `{ ${JSON.stringify(name)}: ${result} }` : result}
`;

    if (!noImport) {
      result = `${jsdocs}const { z } = require("zod")

${result}`;
    }
  } else if (module === "esm") {
    result = `${jsdocs}export ${name ? `const ${name} =` : `default`} ${result}
`;

    if (!noImport) {
      result = `import { z } from "zod"

${result}`;
    }
  } else if (name) {
    result = `${jsdocs}const ${name} = ${result}`;
  }

  if (type && name) {
    let typeName = typeof type === "string" ? type : `${name[0].toUpperCase()}${name.substring(1)}`;

    result += `export type ${typeName} = z.infer<typeof ${name}>
`;
  }

  return result;
};
