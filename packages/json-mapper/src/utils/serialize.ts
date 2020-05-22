import {classOf, isEmpty, isFunction, isPlainObject, MetadataTypes, Type} from "@tsed/core";
import {JsonHookContext, JsonSchema, JsonSchemaStore} from "@tsed/schema";
import {getPropertiesStores} from "@tsed/schema/src/utils/getPropertiesStores";
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

function alterIgnore(schema: JsonSchema, options: JsonHookContext) {
  return schema.$hooks.alter("ignore", false, [options]);
}

function alterValue(schema: JsonSchema, value: any, options: JsonHookContext) {
  return schema.$hooks.alter("onSerialize", value, [options]);
}

function getSchemaProperties(storedJson: JsonSchemaStore) {
  return Array.from(getPropertiesStores(storedJson).entries());
}

function getObjectProperties(obj: any): [string, any][] {
  return Object.entries(obj).filter(([, value]) => !isFunction(value));
}

function classToPlainObject(obj: any, options: JsonSerializerOptions<any, any>) {
  const {useAlias = true} = options;
  const storedJson = JsonSchemaStore.from(obj);

  return getSchemaProperties(storedJson).reduce((newObj, [key, propStore]) => {
    const schema = propStore.schema;

    if (alterIgnore(schema, {...options, self: obj})) {
      return newObj;
    }

    const value = serialize(alterValue(schema, obj[key], {...options, self: obj}), options);
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

  return !isPlainObject(obj) ? classToPlainObject(obj, options) : toObject(obj, options);
}
