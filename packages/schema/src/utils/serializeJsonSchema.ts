import {classOf, cleanObject, deepExtends, isArray, isObject} from "@tsed/core";
import {mapAliasedProperties} from "../domain/JsonAliasMap";
import {JsonLazyRef} from "../domain/JsonLazyRef";
import {JsonSchema} from "../domain/JsonSchema";
import {SpecTypes} from "../domain/SpecTypes";
import {alterIgnore} from "../hooks/alterIgnore";
import {JsonSchemaOptions} from "../interfaces";
import {createRef, createRefName} from "./createRef";
import {GenericsContext, mapGenericsOptions, popGenerics} from "./generics";
import {getInheritedStores} from "./getInheritedStores";
import {getJsonEntityStore} from "./getJsonEntityStore";
import {getRequiredProperties} from "./getRequiredProperties";

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
export function serializeClass(value: any, options: JsonSchemaOptions = {}) {
  const store = getJsonEntityStore(value.class);
  const name = createRefName(store.schema.getName() || value.getName(), options);

  if (value.hasGenerics) {
    // Inline generic
    const {type, properties, additionalProperties, items, ...props} = value.toJSON(options);
    const schema = {
      ...serializeAny(store.schema, {
        ...options,
        ...popGenerics(value),
        root: false
      }),
      ...props
    };

    if (schema.title) {
      const name = createRefName(schema.title, options);
      options.schemas![name] = schema;
      delete schema.title;

      return createRef(name, options);
    }

    return schema;
  }

  if (options.schemas && !options.schemas[name]) {
    options.schemas[name] = {}; // avoid infinite calls
    options.schemas[name] = serializeAny(
      store.schema,
      mapGenericsOptions({
        ...options,
        root: false
      })
    );
  }

  return createRef(name, options);
}

function toRef(value: any, schema: any, options: JsonSchemaOptions) {
  const name = createRefName(value.getName(), options);

  options.schemas![value.getName()] = schema;

  return createRef(name, options);
}

/**
 * @ignore
 */
export function serializeItem(value: any, options: JsonSchemaOptions) {
  return value && value.isClass ? serializeClass(value, options) : serializeAny(value, options);
}

/**
 * @ignore
 */
export function serializeInherited(obj: any, target: any, options: JsonSchemaOptions = {}) {
  const stores = Array.from(getInheritedStores(target).entries()).filter(([model]) => classOf(model) !== classOf(target));

  if (stores.length) {
    const schema = stores.reduce((obj, [, store]) => {
      return deepExtends(obj, serializeJsonSchema(store.schema, options));
    }, {});

    obj = deepExtends(schema, obj);
  }

  return obj;
}

/**
 * Serialize class which inherit from Map like JsonMap, JsonOperation, JsonParameter.
 * @param input
 * @param ignore
 * @param options
 * @ignore
 */
export function serializeMap(input: Map<string, any>, {ignore = [], ...options}: JsonSchemaOptions = {}): any {
  options = mapGenericsOptions(options);

  return Array.from(input.entries()).reduce((obj: any, [key, value]) => {
    if (ignore.includes(key)) {
      return obj;
    }

    obj[key] = serializeItem(value, options);
    return obj;
  }, {});
}

/**
 * Serialize Any object to a json schema
 * @param input
 * @param options
 * @ignore
 */
export function serializeObject(input: any, options: JsonSchemaOptions) {
  const {specType, operationIdFormatter, root, schemas, genericTypes, nestedGenerics, useAlias, genericLabels, ...ctx} = options;

  return Object.entries(input).reduce<any>(
    (obj, [key, value]: any[]) => {
      if (options.withIgnoredProps !== false && !alterIgnore(value, ctx)) {
        // remove groups to avoid bad schema generation over children models
        obj[key] = serializeItem(value, {...options, groups: undefined});
      }

      return obj;
    },
    isArray(input) ? [] : {}
  );
}

export function serializeLazyRef(input: JsonLazyRef, options: JsonSchemaOptions) {
  const name = input.name;

  if (options.$refs?.find((t: any) => t === input.target)) {
    return createRef(name, options);
  }

  options.$refs = [...(options.$refs || []), input.target];

  const schema = input.toJSON(mapGenericsOptions(options));

  return toRef(input.schema, schema, options);
}

/**
 * @ignore
 */
export function serializeAny(input: any, options: JsonSchemaOptions = {}) {
  options.schemas = options.schemas || {};

  if (typeof input !== "object" || input === null) {
    return input;
  }

  if (input instanceof JsonLazyRef) {
    return serializeLazyRef(input, options);
  }

  if ("toJSON" in input) {
    const schema = input.toJSON(mapGenericsOptions(options));

    return input.canRef ? toRef(input, schema, options) : schema;
  }

  return serializeObject(input, options);
}

/**
 * @ignore
 */
export function serializeGenerics(obj: any, options: GenericsContext) {
  const {generics} = options;

  if (generics && obj.$ref) {
    if (generics.has(obj.$ref)) {
      const model = {
        class: generics.get(obj.$ref)
      };

      if (options.nestedGenerics.length === 0) {
        return serializeClass(model, {
          ...options,
          generics: undefined
        });
      }

      const store = getJsonEntityStore(model.class);

      return serializeJsonSchema(store.schema, {
        ...options,
        ...popGenerics(options),
        root: false
      });
    }
  }

  return obj;
}

function shouldSkipKey(key: string, {specType = SpecTypes.JSON, customKeys = false}: JsonSchemaOptions) {
  return (
    IGNORES.includes(key) ||
    (key.startsWith("#") && (customKeys === false || specType !== SpecTypes.JSON)) ||
    (specType === SpecTypes.SWAGGER && IGNORES_OS2.includes(key)) ||
    (specType !== SpecTypes.JSON && IGNORES_OPENSPEC.includes(key))
  );
}

function transformTypes(obj: any) {
  const nullable = obj.type.includes("null") ? true : undefined;

  const types = obj.type.reduce((types: string[], type: string) => {
    if (type !== "null") {
      return [...types, cleanObject({type, nullable})];
    }
    return types;
  }, []);

  if (types.length > 1) {
    obj.oneOf = types;
  } else {
    obj.type = types[0].type;
    obj.nullable = types[0].nullable;
  }

  return obj;
}

/**
 * Convert JsonSchema instance to plain json object
 * @param schema
 * @param options
 * @ignore
 */
export function serializeJsonSchema(schema: JsonSchema, options: JsonSchemaOptions = {}): any {
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
        value = serializeClass(value, {
          ...options,
          useAlias,
          schemas
        });
      } else {
        value = serializeAny(value, {
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
    obj = serializeInherited(obj, schema.getComputedType(), {...options, root: false, schemas});
  }

  obj = serializeGenerics(obj, {...options, root: false, schemas} as any);

  if (schema.has(options.specType as string)) {
    obj = {
      ...obj,
      ...schema.get(options.specType as string).toJSON(options)
    };
  }

  obj = getRequiredProperties(obj, schema, {...options, useAlias});

  if (options.specType === SpecTypes.OPENAPI && isArray(obj.type)) {
    obj = transformTypes(obj);
  }

  if ((obj.oneOf || obj.allOf || obj.anyOf) && !(obj.items || obj.properties)) {
    delete obj.type;
  }

  return obj;
}
