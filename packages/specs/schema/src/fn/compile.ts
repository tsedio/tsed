import "../components/index.js";
import {DecoratorTypes, getValue, isClass, isPlainObject, nameOf, Type} from "@tsed/core";
import {JsonSchema, SpecTypes} from "../domain/index.js";
import {JsonParameterStore} from "../components/index.js";
import {JsonSchemaOptions} from "../domain/JsonSchemaOptions.js";
import {execMapper} from "../registries/JsonSchemaMapperContainer.js";
import {getJsonEntityStore} from "../registries/JsonEntitiesContainer.js";
import {inlineRefs} from "../utils/inlineRefs.js";

/**
 * @ignore
 */
const CACHES = new Map<Type | JsonParameterStore | JsonSchema, Map<string, any>>();

/**
 * @ignore
 */
function getKey(options: any) {
  return JSON.stringify(options, (key, value) => {
    if (value && !isPlainObject(value) && isClass(value)) {
      return nameOf(value);
    }

    return value;
  });
}

/**
 * @ignore
 */
function get(model: Type | JsonParameterStore | JsonSchema, options: any) {
  const cache: Map<string, any> = CACHES.get(model) || new Map();
  CACHES.set(model, cache);

  const key = getKey(options);

  if (!cache.has(key)) {
    let schema: any;

    if (model instanceof JsonSchema) {
      schema = model.toJSON(options);
    } else {
      const entity = getJsonEntityStore(model);

      let mapper = "schema";
      if (entity.is(DecoratorTypes.PARAM)) {
        options = {
          ...options,
          root: true,
          groups: entity.schema.getGroups()
        };
        mapper = "item";
      }

      schema = execMapper(mapper, [entity.schema], options);
    }

    if (Object.keys(getValue(options, "components.schemas", {})).length) {
      schema.definitions = options.components.schemas;
    }

    cache.set(key, options.inlineRefs ? inlineRefs(schema) : schema);
  }

  return cache.get(key);
}

/**
 * Compile a class, parameter store, or `JsonSchema` into a plain JSON schema object.
 *
 * This is an alias of `getJsonSchema(...)`.
 *
 * @param model Class, parameter store, or `JsonSchema` to compile.
 * @param options JSON schema generation options.
 * @returns Compiled JSON schema object.
 */
export function compile(model: Type<any> | JsonParameterStore | JsonSchema<any>, options: JsonSchemaOptions = {}) {
  const specType = options.specType || SpecTypes.JSON;

  options = {
    endpoint: true,
    groups: [],
    inlineEnums: specType === SpecTypes.JSON,
    ...options,
    specType,
    components: {
      schemas: {}
    }
  };

  return get(model, options);
}

/**
 * @deprecated Use s.compile() instead
 * @param model
 * @param options
 */
export const getJsonSchema = compile;
