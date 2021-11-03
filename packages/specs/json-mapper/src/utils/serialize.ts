import {classOf, isArray, isClassObject, isCollection, isEmpty, isFunction, isNil, MetadataTypes, objectKeys, Type} from "@tsed/core";
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

function getSchemaProperties(storedJson: JsonEntityStore, obj: any) {
  const stores = Array.from(getPropertiesStores(storedJson).entries());

  if (!stores.length) {
    // fallback to auto discovering field from obj
    objectKeys(obj).forEach((key) => {
      const propStore = JsonEntityStore.from(classOf(storedJson.target), key);
      stores.push([key, propStore]);
    });
  }

  return stores;
}

function getObjectProperties(obj: any): [string, any][] {
  return Object.entries(obj).filter(([, value]) => !isFunction(value));
}

function getType(propStore: JsonEntityStore, value: any) {
  if (isNil(value) || propStore.type === Object || isCollection(propStore.type)) {
    return undefined;
  }

  return propStore.type;
}

export function classToPlainObject(obj: any, options: JsonSerializerOptions<any, any>) {
  const {useAlias = true, type, ...props} = options;

  const entity = JsonEntityStore.from(type || obj);

  return getSchemaProperties(entity, obj).reduce((newObj, [key, propStore]) => {
    const schema = propStore.schema;

    if (alterIgnore(schema, {useAlias, ...props, self: obj})) {
      return newObj;
    }

    let value = alterValue(schema, obj[key], {useAlias, ...props, self: obj});
    value = serialize(value, {
      useAlias,
      type: value === obj[key] ? getType(propStore, value) : undefined,
      collectionType: propStore.collectionType,
      ...props
    });

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

function getBestType(type: Type<any>, obj: any) {
  const dataType = classOf(obj);

  if (dataType && !isClassObject(dataType)) {
    return dataType;
  }

  return type || Object;
}

export function serialize(obj: any, {type, collectionType, groups = false, ...options}: JsonSerializerOptions = {}): any {
  if (isEmpty(obj)) {
    return obj;
  }

  const types = options.types ? options.types : getJsonMapperTypes();
  options.groups = groups;

  // FIX custom serialization function from @tsed/mongoose and bson
  if ((typeof obj.toJSON === "function" && obj.$isMongooseModelPrototype) || obj._bsontype) {
    return obj.toJSON(options);
  }

  if (typeof obj.toJSON === "function") {
    return serialize(obj.toJSON(), {...options, type: classOf(obj)});
  }

  if (!isCollection(obj)) {
    options.type = type = getBestType(type, obj);
  } else if (!options.collectionType) {
    type = classOf(obj);
    options.collectionType = type;
  }

  const context = new JsonMapperContext({
    type,
    options,
    next: (data) =>
      serialize(data, {
        ...options,
        collectionType: undefined,
        type: options.type
      })
  });

  if (types.has(type)) {
    const jsonMapper = types.get(type)!;

    return jsonMapper.serialize(obj, context);
  }

  if (isArray(obj)) {
    // Serialize Array class like
    return types.get(Array)?.serialize(obj, context);
  }

  return !isClassObject(type) ? classToPlainObject(obj, options) : toObject(obj, options);
}
