import {classOf, isClass, isCollection, isEmpty, isFunction, isPlainObject, MetadataTypes, Type} from "@tsed/core";
import {alterIgnore, getPropertiesStores, JsonEntityStore, JsonHookContext, JsonSchema} from "@tsed/schema";
import "../components";
import {JsonMapperContext} from "../domain/JsonMapperContext";
import {getJsonMapperTypes} from "../domain/JsonMapperTypesContainer";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods";

export interface JsonSerializerOptions<T = any, C = any> extends MetadataTypes<T, C> {
  /**
   * Types used to map complex types (Symbol, Array, Set, Map)
   */
  types?: Map<Type<any>, JsonMapperMethods>;
  /**
   * useAlias mapping
   */
  useAlias?: boolean;

  [key: string]: any;
}

function alterValue(schema: JsonSchema, value: any, options: JsonHookContext) {
  return schema.$hooks.alter("onSerialize", value, [options]);
}

function getSchemaProperties(storedJson: JsonEntityStore) {
  return Array.from(getPropertiesStores(storedJson).entries());
}

function getObjectProperties(obj: any): [string, any][] {
  return Object.entries(obj).filter(([, value]) => !isFunction(value));
}

export function classToPlainObject(obj: any, options: JsonSerializerOptions<any, any>) {
  const {useAlias = true, type, ...props} = options;

  const entity = JsonEntityStore.from(type || obj);

  return getSchemaProperties(entity).reduce((newObj, [key, propStore]) => {
    const schema = propStore.schema;
    if (alterIgnore(schema, {useAlias, ...props, self: obj})) {
      return newObj;
    }

    let value = alterValue(schema, obj[key], {useAlias, ...props, self: obj});

    value = serialize(value, {useAlias, ...props});

    if (value === undefined) {
      return newObj;
    }

    key = useAlias ? propStore.parent.schema.getAliasOf(key) || key : key;

    return {
      ...newObj,
      [key]: value
    };
  }, {});
}

function toObject(obj: any, options: JsonSerializerOptions): any {
  return getObjectProperties(obj).reduce(
    (newObj, [key, value]) => ({
      ...newObj,
      [key]: serialize(value, options)
    }),
    {}
  );
}

export function serialize(obj: any, {type, collectionType, ...options}: JsonSerializerOptions = {}): any {
  const types = options.types ? options.types : getJsonMapperTypes();

  if (isEmpty(obj)) {
    return obj;
  }

  if (obj.$toObject) {
    // mongoose
    return serialize(obj.$toObject(options, true), {type, collectionType, ...options});
  }

  if (type && isClass(type)) {
    options.type = type;
  }

  if (isCollection(obj) && !options.collectionType) {
    type = classOf(obj);
    options.collectionType = type;
  }

  type = classOf(type || obj);

  const context = new JsonMapperContext({
    type,
    options,
    next: (data, {type, ...options}) => serialize(data, options)
  });

  if (types.has(type)) {
    const jsonMapper = types.get(type)!;

    return jsonMapper.serialize(obj, context);
  }

  if (typeof obj.toJSON === "function") {
    // serialize from serialize method
    return obj.toJSON(context);
  }

  if (typeof obj.serialize === "function") {
    // serialize from serialize method
    return obj.serialize(context);
  }

  return !isPlainObject(type) ? classToPlainObject(obj, options) : toObject(obj, options);
}
