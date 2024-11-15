import {getValue, isObject} from "@tsed/core";
import {mapAliasedProperties} from "../../domain/JsonAliasMap.js";
import {JsonSchema} from "../../domain/JsonSchema.js";
import {SpecTypes} from "../../domain/SpecTypes.js";
import {alterOneOf} from "../../hooks/alterOneOf.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, hasMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

/**
 * @ignore
 */
const IGNORES = ["name", "$required", "$hooks", "_nestedGenerics", SpecTypes.OPENAPI, SpecTypes.SWAGGER, SpecTypes.JSON];
/**
 * @ignore
 */
const IGNORES_OPENSPEC: string[] = [];

/**
 * @ignore
 */
function isEmptyProperties(key: string, value: any) {
  return typeof value === "object" && ["items", "properties", "additionalProperties"].includes(key) && Object.keys(value).length === 0;
}

/**
 * @ignore
 */
function shouldMapAlias(key: string, value: any, useAlias: boolean) {
  return typeof value === "object" && useAlias && ["properties", "additionalProperties"].includes(key);
}

/**
 * @ignore
 */
function shouldSkipKey(key: string, {specType = SpecTypes.JSON, customKeys = false}: JsonSchemaOptions) {
  return (
    IGNORES.includes(key) ||
    (key.startsWith("#") && (customKeys === false || specType !== SpecTypes.JSON)) ||
    (specType !== SpecTypes.JSON && IGNORES_OPENSPEC.includes(key))
  );
}

function isExample(key: string, value: any, options: JsonSchemaOptions) {
  return key === "examples" && isObject(value) && [SpecTypes.OPENAPI, SpecTypes.ASYNCAPI].includes(options.specType!)!;
}

function mapOptions(options: JsonSchemaOptions) {
  let addDef = false;

  if (!options) {
    addDef = true;
    options = {components: {schemas: {}}, inlineEnums: true};
  }

  const {useAlias = true, components = {schemas: {}}} = options;
  options = {
    ...options,
    useAlias,
    components
  };

  return {
    addDef,
    options
  };
}

function mapKeys(schema: JsonSchema, options: JsonSchemaOptions) {
  const {useAlias} = options;

  return [...schema.keys()]
    .filter((key) => !shouldSkipKey(key, options))
    .reduce((item: any, key) => {
      let value = schema.get(key);

      key = key.replace(/^#/, "");

      if (key === "type") {
        item[key] = schema.getJsonType();
        return item;
      }

      if (isExample(key, value, options)) {
        key = "example";
        value = Object.values(value)[0];
      }

      if (value && typeof value === "object" && hasMapper(key)) {
        value = execMapper(key, [value], options, schema);

        if (isEmptyProperties(key, value)) {
          return item;
        }

        if (shouldMapAlias(key, value, useAlias!)) {
          value = mapAliasedProperties(value, schema.alias);
        }
      }

      item[key] = value;

      return item;
    }, {});
}

function serializeSchema(schema: JsonSchema, options: JsonSchemaOptions) {
  let obj: any = mapKeys(schema, options);

  if (schema.isClass) {
    obj = execMapper("inheritedClass", [obj], {
      ...options,
      root: false,
      target: schema.getComputedType()
    });
  }

  obj = execMapper("generics", [obj], {
    ...options,
    root: false
  } as any);

  if (schema.has(options.specType as string)) {
    obj = {
      ...obj,
      ...schema.get(options.specType as string).toJSON(options)
    };
  }

  obj = execMapper("required", [obj, schema], options);
  obj = execMapper("nullable", [obj, schema], options);
  obj = alterOneOf(obj, schema, options);
  obj = execMapper("enums", [obj, schema], options);
  obj = execMapper("discriminatorMapping", [obj, schema], options);

  return obj;
}

export function schemaMapper(schema: JsonSchema, opts: JsonSchemaOptions): any {
  const {options, addDef} = mapOptions(opts);

  const obj = serializeSchema(schema, options);

  if (addDef && Object.keys(getValue(options, "components.schemas", {})).length) {
    obj.definitions = options.components!.schemas;
  }

  return obj;
}

registerJsonSchemaMapper("schema", schemaMapper);
