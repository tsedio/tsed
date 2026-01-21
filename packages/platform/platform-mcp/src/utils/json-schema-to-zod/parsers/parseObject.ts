import {JsonSchemaObject, Refs} from "../Types.js";
import {addJsdocs} from "../utils/jsdocs.js";
import {parseAllOf} from "./parseAllOf.js";
import {parseAnyOf} from "./parseAnyOf.js";
import {parseOneOf} from "./parseOneOf.js";
import {its, parseSchema} from "./parseSchema.js";

// Helper for z.record() generation - Zod v4 requires explicit key type
function emitRecord(valueSchema: string, refs: Refs): string {
  if (refs.zodVersion === 3) {
    return `z.record(${valueSchema})`;
  }
  // Default to v4 syntax
  return `z.record(z.string(), ${valueSchema})`;
}

// Helper for error path in superRefine - Zod v4 uses simplified path
function emitErrorPath(refs: Refs): string {
  if (refs.zodVersion === 3) {
    return `path: [...ctx.path, key]`;
  }
  // Default to v4 syntax
  return `path: [key]`;
}

/**
 * Parses object schemas, wiring properties, patternProperties, and catchall behavior into the resulting Zod object.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export function parseObject(objectSchema: JsonSchemaObject & {type: "object"}, refs: Refs): string {
  let properties: string | undefined = undefined;

  if (objectSchema.properties) {
    if (!Object.keys(objectSchema.properties).length) {
      properties = "z.object({})";
    } else {
      properties = "z.object({ ";

      properties += Object.keys(objectSchema.properties)
        .map((key) => {
          const propSchema = objectSchema.properties![key];

          let result = `${JSON.stringify(key)}: ${parseSchema(propSchema, {
            ...refs,
            path: [...refs.path, "properties", key]
          })}`;

          if (refs.withJsdocs && typeof propSchema === "object") {
            result = addJsdocs(propSchema, result);
          }

          const hasDefault = typeof propSchema === "object" && propSchema.default !== undefined;

          const required = Array.isArray(objectSchema.required)
            ? objectSchema.required.includes(key)
            : typeof propSchema === "object" && propSchema.required === true;

          const optional = !hasDefault && !required;

          return optional ? `${result}.optional()` : result;
        })
        .join(", ");

      properties += " })";
    }
  }

  const additionalProperties =
    objectSchema.additionalProperties !== undefined
      ? parseSchema(objectSchema.additionalProperties, {
          ...refs,
          path: [...refs.path, "additionalProperties"]
        })
      : undefined;

  let patternProperties: string | undefined = undefined;

  if (objectSchema.patternProperties) {
    const parsedPatternProperties = Object.fromEntries(
      Object.entries(objectSchema.patternProperties).map(([key, value]) => {
        return [
          key,
          parseSchema(value, {
            ...refs,
            path: [...refs.path, "patternProperties", key]
          })
        ];
      }, {})
    );

    patternProperties = "";

    if (properties) {
      if (additionalProperties) {
        patternProperties += `.catchall(z.union([${[...Object.values(parsedPatternProperties), additionalProperties].join(", ")}]))`;
      } else if (Object.keys(parsedPatternProperties).length > 1) {
        patternProperties += `.catchall(z.union([${Object.values(parsedPatternProperties).join(", ")}]))`;
      } else {
        patternProperties += `.catchall(${Object.values(parsedPatternProperties)})`;
      }
    } else {
      if (additionalProperties) {
        patternProperties += emitRecord(`z.union([${[...Object.values(parsedPatternProperties), additionalProperties].join(", ")}])`, refs);
      } else if (Object.keys(parsedPatternProperties).length > 1) {
        patternProperties += emitRecord(`z.union([${Object.values(parsedPatternProperties).join(", ")}])`, refs);
      } else {
        patternProperties += emitRecord(`${Object.values(parsedPatternProperties)}`, refs);
      }
    }

    patternProperties += ".superRefine((value, ctx) => {\n";

    patternProperties += "for (const key in value) {\n";

    if (additionalProperties) {
      if (objectSchema.properties) {
        patternProperties += `let evaluated = [${Object.keys(objectSchema.properties)
          .map((key) => JSON.stringify(key))
          .join(", ")}].includes(key)\n`;
      } else {
        patternProperties += `let evaluated = false\n`;
      }
    }

    for (const key in objectSchema.patternProperties) {
      patternProperties += "if (key.match(new RegExp(" + JSON.stringify(key) + "))) {\n";
      if (additionalProperties) {
        patternProperties += "evaluated = true\n";
      }
      patternProperties += "const result = " + parsedPatternProperties[key] + ".safeParse(value[key])\n";
      patternProperties += "if (!result.success) {\n";

      patternProperties += `ctx.addIssue({
          ${emitErrorPath(refs)},
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })\n`;

      patternProperties += "}\n";
      patternProperties += "}\n";
    }

    if (additionalProperties) {
      patternProperties += "if (!evaluated) {\n";
      patternProperties += "const result = " + additionalProperties + ".safeParse(value[key])\n";
      patternProperties += "if (!result.success) {\n";

      patternProperties += `ctx.addIssue({
          ${emitErrorPath(refs)},
          code: 'custom',
          message: \`Invalid input: must match catchall schema\`,
          params: {
            issues: result.error.issues
          }
        })\n`;

      patternProperties += "}\n";
      patternProperties += "}\n";
    }
    patternProperties += "}\n";
    patternProperties += "})";
  }

  let output = properties
    ? patternProperties
      ? properties + patternProperties
      : additionalProperties
        ? additionalProperties === "z.never()"
          ? properties + ".strict()"
          : properties + `.catchall(${additionalProperties})`
        : properties
    : patternProperties
      ? patternProperties
      : additionalProperties
        ? emitRecord(additionalProperties, refs)
        : emitRecord("z.any()", refs);

  if (its.an.anyOf(objectSchema)) {
    output += `.and(${parseAnyOf(
      {
        ...objectSchema,
        anyOf: objectSchema.anyOf.map((x) =>
          typeof x === "object" && !x.type && (x.properties || x.additionalProperties || x.patternProperties) ? {...x, type: "object"} : x
        ) as any
      },
      refs
    )})`;
  }

  if (its.a.oneOf(objectSchema)) {
    output += `.and(${parseOneOf(
      {
        ...objectSchema,
        oneOf: objectSchema.oneOf.map((x) =>
          typeof x === "object" && !x.type && (x.properties || x.additionalProperties || x.patternProperties) ? {...x, type: "object"} : x
        ) as any
      },
      refs
    )})`;
  }

  if (its.an.allOf(objectSchema)) {
    output += `.and(${parseAllOf(
      {
        ...objectSchema,
        allOf: objectSchema.allOf.map((x) =>
          typeof x === "object" && !x.type && (x.properties || x.additionalProperties || x.patternProperties) ? {...x, type: "object"} : x
        ) as any
      },
      refs
    )})`;
  }

  return output;
}
