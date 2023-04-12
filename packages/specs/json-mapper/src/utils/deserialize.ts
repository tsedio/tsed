import {getValue, isArray, isBoolean, isClass, isEmpty, isNil, MetadataTypes, nameOf, objectKeys, Type} from "@tsed/core";
import {
  alterIgnore,
  Discriminator,
  getProperties,
  JsonEntityStore,
  JsonHookContext,
  JsonParameterStore,
  JsonPropertyStore,
  JsonSchema
} from "@tsed/schema";
import "../components/ArrayMapper";
import "../components/DateMapper";
import "../components/MapMapper";
import "../components/PrimitiveMapper";
import "../components/SetMapper";
import "../components/SymbolMapper";
import {JsonMapperContext} from "../domain/JsonMapperContext";
import {JsonMapperSettings} from "../domain/JsonMapperSettings";
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
   *
   */
  disableUnsecureConstructor?: boolean;
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

function getAdditionalProperties(
  nbProps: number,
  store: JsonEntityStore,
  options: JsonDeserializerOptions<any, any>
): boolean | JsonSchema {
  const additionalProperties = store.schema.get("additionalProperties");

  if (isBoolean(additionalProperties) || isClass(additionalProperties)) {
    return additionalProperties;
  }

  return nbProps === 0 || !!options.additionalProperties;
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

  const additionalProperties = getAdditionalProperties(propertiesMap.size, store, options);
  src = alterBeforeDeserialize(src, store.schema, options);

  const out: any = new type(options.disableUnsecureConstructor ? {} : src);

  propertiesMap.forEach((propStore) => {
    const key = options.useAlias
      ? propStore.parent.schema.getAliasOf(propStore.propertyName) || propStore.propertyName
      : propStore.propertyName;

    keys.delete(key);

    if (alterIgnore(propStore.schema, options)) {
      return;
    }

    let value = alterValue(propStore.schema, src[key], {...options, self: src});

    value =
      value === src[key]
        ? deserialize(value, {
            ...options,
            store: propStore,
            format: propStore.itemSchema.get("format"),
            self: src,
            collectionType: propStore.collectionType
          })
        : value;

    if (!propStore.isGetterOnly()) {
      if (value !== undefined) {
        out[propStore.propertyName] = value;
      } else if (options.partial) {
        delete out[propStore.propertyName];
      }
    }
  });

  if (additionalProperties) {
    if (isBoolean(additionalProperties)) {
      keys.forEach((key) => {
        out[key] = src[key];
      });
    } else {
      const type = additionalProperties.getComputedType();
      keys.forEach((key) => {
        out[key] = deserialize(src[key], {
          ...options,
          type
        });
      });
    }
  }

  return alterAfterDeserialize(out, store.schema, options);
}

function mapPropStoreOptions(store: JsonPropertyStore, options: JsonDeserializerOptions) {
  const itemOpts: JsonDeserializerOptions = {
    ...options,
    store: undefined,
    type: store.computedType
  };

  if (store.itemSchema.isDiscriminator) {
    itemOpts.type = store.itemSchema.discriminator();
  }

  if (store.schema.hasGenerics) {
    itemOpts.nestedGenerics = store.schema.nestedGenerics;
  } else if (store.schema.isGeneric && options.nestedGenerics) {
    const [genericTypes = [], ...nestedGenerics] = options.nestedGenerics;
    const genericLabels = store.parent.schema.genericLabels || [];

    itemOpts.type = genericTypes[genericLabels.indexOf(store.schema.genericType)] || Object;

    if (itemOpts.type instanceof JsonSchema) {
      itemOpts.type = itemOpts.type.getTarget();
    }

    itemOpts.nestedGenerics = nestedGenerics;
  }

  return itemOpts;
}

function mapParamStoreOptions(store: JsonParameterStore, options: JsonDeserializerOptions) {
  return {
    ...options,
    store: undefined,
    type: store.getBestType(),
    collectionType: store.collectionType,
    groups: store.parameter.groups,
    genericTypes: store.nestedGenerics[0],
    nestedGenerics: store.nestedGenerics
  };
}

function buildOptions(options: JsonDeserializerOptions<any, any>): any {
  if (options.store instanceof JsonPropertyStore) {
    return buildOptions(mapPropStoreOptions(options.store, options));
  }

  if (options.store instanceof JsonParameterStore) {
    return buildOptions(mapParamStoreOptions(options.store, options));
  }

  if (options.store instanceof JsonEntityStore) {
    options.type = options.store.computedType;
    options.collectionType = options.store.collectionType;
    options.store = undefined;
  } else if (isClass(options.type)) {
    const store = JsonEntityStore.from(options.type);

    if (store.schema.isDiscriminator) {
      options.type = JsonEntityStore.from(options.type).schema.discriminator();
    }
  }

  return {
    groups: false,
    useAlias: true,
    ...options,
    additionalProperties: getValue(options, "additionalProperties", JsonMapperSettings.additionalProperties),
    disableUnsecureConstructor: getValue(options, "disableUnsecureConstructor", JsonMapperSettings.disableUnsecureConstructor),
    partial: options.groups ? options.groups.includes("partial") : false,
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

  if (options.type instanceof Discriminator) {
    const discriminator = options.type;
    const discriminatorValue = src[discriminator.propertyName];
    const type = discriminator.getType(discriminatorValue);

    return plainObjectToClass(src, {...options, type});
  }

  // class converter
  return plainObjectToClass(src, options);
}
