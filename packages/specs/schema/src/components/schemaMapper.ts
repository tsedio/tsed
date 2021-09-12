import {isObject} from "@tsed/core";
import {mapAliasedProperties} from "../domain/JsonAliasMap";
import {JsonSchema} from "../domain/JsonSchema";
import {SpecTypes} from "../domain/SpecTypes";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../registries/JsonSchemaMapperContainer";
import {getRequiredProperties} from "../utils/getRequiredProperties";
import {mapNullableType} from "../utils/mapNullableType";

/**
 * @ignore
 */
const IGNORES = ["name", "$required", "$hooks", "_nestedGenerics", SpecTypes.OPENAPI, SpecTypes.SWAGGER, SpecTypes.JSON];
/**
 * @ignore
 */
const IGNORES_OPENSPEC = ["const"];
const IGNORES_OS2 = ["writeOnly", "readOnly"];

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
    (specType === SpecTypes.SWAGGER && IGNORES_OS2.includes(key)) ||
    (specType !== SpecTypes.JSON && IGNORES_OPENSPEC.includes(key))
  );
}

export function schemaMapper(schema: JsonSchema, options: JsonSchemaOptions = {}): any {
  const {useAlias = true, schemas = {}, genericTypes} = options;

  let obj: any = [...schema.entries()].reduce((item: any, [key, value]) => {
    if (shouldSkipKey(key, options)) {
      return item;
    }

    key = key.replace(/^#/, "");

    if (key === "type") {
      value = schema.getJsonType();
    }

    if (key === "examples" && isObject(value) && [SpecTypes.OPENAPI, SpecTypes.SWAGGER].includes(options.specType!)) {
      key = "example";
      value = Object.values(value)[0];
    }

    if (value) {
      if (value.isClass) {
        value = execMapper("class", value, {
          ...options,
          useAlias,
          schemas
        });
      } else {
        value = execMapper("any", value, {
          ...options,
          useAlias,
          schemas,
          genericTypes,
          genericLabels: schema.genericLabels
        });
      }
    }

    if (isEmptyProperties(key, value)) {
      return item;
    }

    if (shouldMapAlias(key, value, useAlias)) {
      value = mapAliasedProperties(value, schema.alias);
    }

    item[key] = value;

    return item;
  }, {});

  if (schema.isClass) {
    obj = execMapper("inheritedClass", obj, {...options, root: false, schemas, target: schema.getComputedType()});
  }

  obj = execMapper("generics", obj, {...options, root: false, schemas} as any);

  if (schema.has(options.specType as string)) {
    obj = {
      ...obj,
      ...schema.get(options.specType as string).toJSON(options)
    };
  }

  obj = getRequiredProperties(obj, schema, {...options, useAlias});
  obj = mapNullableType(obj, schema, options);

  if ((obj.oneOf || obj.allOf || obj.anyOf) && !(obj.items || obj.properties)) {
    delete obj.type;
  }

  return obj;
}

registerJsonSchemaMapper("schema", schemaMapper);
