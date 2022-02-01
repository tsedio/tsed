import {isArray, isEmpty, isNil, MetadataTypes, nameOf, objectKeys, Type} from "@tsed/core";
import {alterIgnore, getProperties, JsonEntityStore, JsonHookContext, JsonPropertyStore, JsonSchema} from "@tsed/schema";
import "../components";
import {JsonMapperContext} from "../domain/JsonMapperContext";
import {getJsonMapperTypes} from "../domain/JsonMapperTypesContainer";
import {alterAfterDeserialize} from "../hooks/alterAfterDeserialize";
import {alterBeforeDeserialize} from "../hooks/alterBeforeDeserialize";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods";

export interface JsonDeserializerOptions<T = any, C = any> extends MetadataTypes<T, C> {
  /**
   * Types used to map complex types (Symbol, Array, Set, Map)
   */
  types?: WeakMap<Type<any>, JsonMapperMethods>;
  /**
   * useAlias mapping
   */
  useAlias?: boolean;
  /**
   * Accept additionalProperties or ignore it
   */
  additionalProperties?: boolean;
  /**
   * Use the store which have all metadata to deserialize correctly the model. This
   * property is useful when you deal with metadata parameters.
   */
  store?: JsonEntityStore;
  /**
   *
   */
  groups?: string[] | false;

  [key: string]: any;
}

function isDeserializable(obj: any, options: JsonDeserializerOptions) {
  if ((!!options.collectionType && isNil(obj)) || obj === undefined) {
    return false;
  }

  return !(isEmpty(options.type) || (options.type === Object && !options.collectionType));
}

function alterValue(schema: JsonSchema, value: any, options: JsonHookContext) {
  return schema.$hooks.alter("onDeserialize", value, [options]);
}

function transformCollection<T = any>(src: any, options: JsonDeserializerOptions<any, any>): T {
  const {types, type = Object, collectionType} = options;

  const context = new JsonMapperContext({
    type,
    collectionType,
    options,
    next: (data, {collectionType, ...options}) => deserialize(data, options)
  });

  return types?.get(options.collectionType)?.deserialize<T>(src, context);
}

function transformType<T = any>(src: any, options: JsonDeserializerOptions<any, any>): T {
  const {types, type = Object} = options;

  const context = new JsonMapperContext({
    type,
    options,
    next: (data, {type, ...options}) => deserialize(data, options)
  });

  return types?.get(type)?.deserialize<T>(src, context);
}

function mapItemOptions(propStore: JsonPropertyStore, options: JsonDeserializerOptions) {
  const itemOpts: JsonDeserializerOptions = {
    ...options,
    store: undefined,
    type: propStore.computedType
  };

  if (propStore.schema.hasGenerics) {
    itemOpts.nestedGenerics = propStore.schema.nestedGenerics;
  } else if (propStore.schema.isGeneric && options.nestedGenerics) {
    const [genericTypes = [], ...nestedGenerics] = options.nestedGenerics;
    const genericLabels = propStore.parent.schema.genericLabels || [];

    itemOpts.type = genericTypes[genericLabels.indexOf(propStore.schema.genericType)] || Object;

    if (itemOpts.type instanceof JsonSchema) {
      itemOpts.type = itemOpts.type.getTarget();
    }

    itemOpts.nestedGenerics = nestedGenerics;
  }

  return itemOpts;
}

/**
 * Transform given plain object to class.
 * @param src
 * @param options
 */
export function plainObjectToClass<T = any>(src: any, options: JsonDeserializerOptions): T {
  if (isEmpty(src)) {
    return src;
  }

  const {type, store = JsonEntityStore.from(type)} = options;
  const propertiesMap = getProperties(store, {...options, withIgnoredProps: true});

  let keys = new Set<any>(objectKeys(src));
  const additionalProperties = propertiesMap.size ? !!store.schema.get("additionalProperties") || options.additionalProperties : true;

  src = alterBeforeDeserialize(src, store.schema, options);

  const out: any = new type(src);

  propertiesMap.forEach((propStore) => {
    const key = options.useAlias
      ? propStore.parent.schema.getAliasOf(propStore.propertyName) || propStore.propertyName
      : propStore.propertyName;

    keys.delete(key);

    if (alterIgnore(propStore.schema, options)) {
      return;
    }

    let value = alterValue(propStore.schema, src[key], {...options, self: src});

    const itemOptions = mapItemOptions(propStore, options);

    value = deserialize(value, {
      ...itemOptions,
      type: value === src[key] ? itemOptions.type : undefined,
      collectionType: propStore.collectionType
    });

    if (value !== undefined) {
      out[propStore.propertyName] = value;
    }
  });

  if (additionalProperties) {
    keys.forEach((key) => {
      out[key] = src[key];
    });
  }

  return alterAfterDeserialize(out, store.schema, options);
}

function buildOptions(options: JsonDeserializerOptions<any, any>): any {
  if (options.store instanceof JsonEntityStore) {
    if (options.store.parameter && options.store.parameter.nestedGenerics.length) {
      options.nestedGenerics = options.store.parameter.nestedGenerics;
    }

    options.type = options.store.computedType;
    options.collectionType = options.store.collectionType;

    delete options.store;
  }

  return {
    groups: false,
    useAlias: true,
    ...options,
    type: options.type ? options.type : undefined,
    types: options.types ? options.types : getJsonMapperTypes()
  };
}

/**
 * Transform given source to class base on the given `options.type`.
 *
 * @param src
 * @param options
 */
export function deserialize<T = any>(src: any, options: JsonDeserializerOptions = {}): T {
  options = buildOptions(options);

  if (!isDeserializable(src, options)) {
    return src;
  }

  if (!options.collectionType && isArray(src)) {
    options.collectionType = Array;
  }

  if (options.collectionType) {
    if (!options.types?.has(options.collectionType)) {
      throw new Error(`${nameOf(options.collectionType)} is not supported by JsonMapper.`);
    }

    return transformCollection(src, options);
  }

  if (options.types?.has(options.type)) {
    return transformType(src, options);
  }

  // class converter
  return plainObjectToClass(src, options);
}
