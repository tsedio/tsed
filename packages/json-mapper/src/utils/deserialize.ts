import {isArray, isEmpty, isNil, MetadataTypes, nameOf, Type} from "@tsed/core";
import {JsonHookContext, JsonSchema, JsonSchemaStore} from "@tsed/schema";
import {getPropertiesStores} from "@tsed/schema/src/utils/getPropertiesStores";
import "../components";
import {JsonMapperContext} from "../domain/JsonMapperContext";
import {getJsonMapperTypes} from "../domain/JsonMapperTypesContainer";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods";

export interface JsonDeserializerOptions<T = any, C = any> extends MetadataTypes<T, C> {
  /**
   * Types used to map complex types (Symbol, Array, Set, Map)
   */
  types?: Map<Type<any>, JsonMapperMethods>;
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
  store?: JsonSchemaStore;

  [key: string]: any;
}

function isDeserializable(obj: any, options: JsonDeserializerOptions) {
  if (!!options.collectionType && isNil(obj)) {
    return false;
  }

  return !(isEmpty(options.type) || options.type === Object);
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

/**
 * Transform given plain object to class.
 * @param src
 * @param options
 */
export function plainObjectToClass<T = any>(src: any, options: JsonDeserializerOptions): T {
  if (isEmpty(src)) {
    return src;
  }

  const {type, store = JsonSchemaStore.from(type), ...next} = options;
  const propertiesMap = getPropertiesStores(store);
  let keys = Object.keys(src);
  const additionalProperties = propertiesMap.size ? !!store.schema.get("additionalProperties") || options.additionalProperties : true;
  const out: any = new type(src);

  propertiesMap.forEach(propStore => {
    const key = propStore.parent.schema.getAliasOf(propStore.propertyName) || propStore.propertyName;
    keys = keys.filter(k => k !== key);

    let value = alterValue(propStore.schema, src[key], {...options, self: src});

    next.type = propStore.computedType;

    if (propStore.schema.hasGenerics) {
      next.nestedGenerics = propStore.schema.nestedGenerics;
    } else if (propStore.schema.isGeneric && options.nestedGenerics) {
      const [genericTypes = [], ...nestedGenerics] = options.nestedGenerics;
      const genericLabels = propStore.parent.schema.genericLabels || [];

      next.type = genericTypes[genericLabels.indexOf(propStore.schema.genericType)] || Object;
      next.nestedGenerics = nestedGenerics;
    }

    value = deserialize(value, {
      ...next,
      collectionType: propStore.collectionType
    });

    out[propStore.propertyName] = value;
  });

  if (additionalProperties) {
    keys.forEach(key => {
      out[key] = src[key];
    });
  }

  return out;
}

function buildOptions(options: JsonDeserializerOptions<any, any>) {
  if (options.store instanceof JsonSchemaStore) {
    if (options.store.parameter && options.store.parameter.nestedGenerics.length) {
      options.nestedGenerics = options.store.parameter.nestedGenerics;
    }

    options.type = options.store.computedType;
    options.collectionType = options.store.collectionType;
  }

  return {
    ...options,
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
