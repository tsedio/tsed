import {classOf, deepExtends, Hooks, isArray} from "@tsed/core";
import {JsonSchema} from "../domain/JsonSchema";
import {mapAliasedProperties} from "../domain/JsonAliasMap";
import {JsonSerializerOptions} from "../interfaces";
import {GenericsContext, mapGenericsOptions, popGenerics} from "./generics";
import {getInheritedStores} from "./getInheritedStores";
import {getJsonSchemaStore} from "./getJsonSchemaStore";

const IGNORES = ["name", "$required", "$hooks", "_nestedGenerics"];

function shouldIgnore(value: {$hooks: Hooks}, options: any) {
  return !!(value && value.$hooks && value.$hooks.alter("ignore", false, [options]));
}

function isEmptyProperties(key: string, value: any) {
  return typeof value === "object" && ["items", "properties", "additionalProperties"].includes(key) && Object.keys(value).length === 0;
}

function shouldMapAlias(key: string, value: any, useAlias: boolean) {
  return typeof value === "object" && useAlias && ["properties", "additionalProperties"].includes(key);
}

function getRequired(schema: any, useAlias: boolean) {
  return Array.from(schema.$required).map(key => (useAlias ? (schema.alias.get(key) as string) || key : key));
}

export function createRef(value: any, options: JsonSerializerOptions = {}) {
  const store = getJsonSchemaStore(value.class);
  const name = store.schema.getName() || value.getName();

  if (value.hasGenerics) {
    return serializeAny(store.schema, {
      ...options,
      ...popGenerics(value),
      root: false
    });
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

  const {host = `#/${options.spec === "openapi3" ? "components/schemas" : "definitions"}`} = options;

  return {
    $ref: `${host}/${name}`
  };
}

export function serializeItem(value: any, options: JsonSerializerOptions) {
  if (value && value.isClass) {
    return createRef(value, {...options, root: false});
  }

  return serializeAny(value, {...options, root: false});
}

export function serializeInherited(obj: any, target: any, options: JsonSerializerOptions = {}) {
  const stores = Array.from(getInheritedStores(target).entries()).filter(([model]) => classOf(model) !== classOf(target));

  if (stores.length) {
    const schema = stores.reduce((obj, [, store]) => {
      return deepExtends(obj, serializeJsonSchema(store.schema, {root: true, ...options}));
    }, {});

    obj = deepExtends(schema, obj);
  }

  return obj;
}

/**
 * Serialize class which inherit from Map like JsonMap, JsonOperation, JsonParameter.
 * @param input
 * @param options
 */
export function serializeMap(input: Map<string, any>, options: JsonSerializerOptions = {}): any {
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
 */
export function serializeObject(input: any, options: JsonSerializerOptions) {
  return Object.entries(input).reduce<any>(
    (obj, [key, value]: any[]) => {
      if (!shouldIgnore(value, options)) {
        obj[key] = serializeItem(value, options);
      }

      return obj;
    },
    isArray(input) ? [] : {}
  );
}

export function serializeAny(input: any, options: JsonSerializerOptions = {}) {
  options.schemas = options.schemas || {};

  if (typeof input !== "object" || input === null) {
    return input;
  }

  if ("toJSON" in input) {
    return input.toJSON(mapGenericsOptions(options));
  }

  return serializeObject(input, options);
}

export function serializeGenerics(obj: any, options: GenericsContext) {
  const {generics} = options;

  if (generics && obj.$ref) {
    if (generics.has(obj.$ref)) {
      const model = {
        class: generics.get(obj.$ref)
      };

      if (options.nestedGenerics.length === 0) {
        return createRef(model, {
          ...options,
          generics: undefined
        });
      }

      const store = getJsonSchemaStore(model.class);

      return serializeJsonSchema(store.schema, {
        ...options,
        ...popGenerics(options),
        root: false
      });
    }
  }

  return obj;
}

/**
 * Convert JsonSchema instance to plain json object
 * @param schema
 * @param options
 */
export function serializeJsonSchema(schema: JsonSchema, options: JsonSerializerOptions = {}): any {
  const {useAlias = true, schemas = {}, root = true, genericTypes} = options;

  let obj: any = Array.from(schema.entries()).reduce((obj: any, [key, value]) => {
    if (IGNORES.includes(key)) {
      return obj;
    }

    if (key === "type") {
      value = schema.getJsonType();
    }

    if (!root && ["properties", "additionalProperties", "items"].includes(key) && value.isClass) {
      value = createRef(value, {
        ...options,
        useAlias,
        schemas,
        root: false
      });
    } else {
      value = serializeAny(value, {
        ...options,
        useAlias,
        schemas,
        root: false,
        genericTypes,
        genericLabels: schema.genericLabels
      });
    }

    if (isEmptyProperties(key, value)) {
      return obj;
    }

    if (shouldMapAlias(key, value, useAlias)) {
      value = mapAliasedProperties(value, schema.alias);
    }

    obj[key] = value;

    return obj;
  }, {});

  if (schema.isClass) {
    obj = serializeInherited(obj, schema.getComputedType(), {...options, root: false, schemas});
  }

  obj = serializeGenerics(obj, {...options, root: false, schemas} as any);

  if (schema.$required.size) {
    obj.required = getRequired(schema, useAlias);
  }

  if (root && Object.keys(schemas).length) {
    obj.definitions = schemas;
  }

  return obj;
}
