import {classOf, deepExtends, isArray, isObject} from "@tsed/core";
import {mapAliasedProperties} from "../domain/JsonAliasMap";
import {JsonSchema} from "../domain/JsonSchema";
import {SpecTypes} from "../domain/SpecTypes";
import {alterIgnore} from "../hooks/ignoreHook";
import {JsonSchemaOptions} from "../interfaces";
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
function createRef(name: string, options: JsonSchemaOptions) {
  const host = getHost(options);
  return {
    $ref: `${host}/${name}`
  };
}

/**
 * @ignore
 */
export function serializeClass(value: any, options: JsonSchemaOptions = {}) {
  const store = getJsonEntityStore(value.class);
  const name = store.schema.getName() || value.getName();

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
      const {title} = schema;
      options.schemas![title] = schema;
      delete schema.title;

      return createRef(title, options);
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

/**
 * ignore
 * @param options
 */
function getHost(options: JsonSchemaOptions) {
  const {host = `#/${options.specType === "openapi3" ? "components/schemas" : "definitions"}`} = options;

  return host;
}

function toRef(value: any, schema: any, options: JsonSchemaOptions) {
  const name = value.getName();
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
 * @param options
 * @ignore
 */
export function serializeMap(input: Map<string, any>, options: JsonSchemaOptions = {}): any {
  options = mapGenericsOptions(options);

  return Array.from(input.entries()).reduce((obj: any, [key, value]) => {
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
  return Object.entries(input).reduce<any>(
    (obj, [key, value]: any[]) => {
      if (!alterIgnore(value, options)) {
        obj[key] = serializeItem(value, options);
      }

      return obj;
    },
    isArray(input) ? [] : {}
  );
}

/**
 * @ignore
 */
export function serializeAny(input: any, options: JsonSchemaOptions = {}) {
  options.schemas = options.schemas || {};

  if (typeof input !== "object" || input === null) {
    return input;
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

function shouldSkipKey(key: string, {specType = SpecTypes.JSON}: JsonSchemaOptions) {
  return IGNORES.includes(key) || (specType !== SpecTypes.JSON && IGNORES_OPENSPEC.includes(key));
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
  obj = getRequiredProperties(obj, schema, useAlias);

  if (schema.has(options.specType as string)) {
    obj = {
      ...obj,
      ...schema.get(options.specType as string).toJSON(options)
    };
  }

  if ((obj.oneOf || obj.allOf || obj.anyOf) && !(obj.items || obj.properties)) {
    delete obj.type;
  }

  return obj;
}
