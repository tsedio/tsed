import {
  ancestorsOf,
  classOf,
  getRandomId,
  hasJsonMethod,
  isClass,
  isCollection,
  isDate,
  isMomentObject,
  isMongooseObject,
  isNil,
  isObject,
  isObjectID,
  isString,
  nameOf,
  objectKeys,
  Type
} from "@tsed/core";
import {JsonSchema} from "@tsed/schema";

/**
 * Signature exposed by compiled mappers. They accept an input value plus contextual options
 * and return the serialized/deserialized result.
 */
export type JsonMapperCallback<Options> = (input: any, options?: Options) => any;
/**
 * Executable mapper plus its unique identifier stored in the compiler cache.
 */
export type CachedJsonMapper<Options> = {
  id: string;
  fn: JsonMapperCallback<Options>;
};

/**
 * Cached mapper registry keyed by the groups fingerprint generated for a schema.
 */
export type CachedGroupsJsonMapper<Options> = Map<string, CachedJsonMapper<Options>>;

/**
 * Base compiler that turns schema metadata into executable (de)serialization functions.
 * Subclasses supply `map`, `alterValue`, and `createMapper` implementations to specialize
 * the pipeline for serialization or deserialization.
 */
export abstract class JsonMapperCompiler<Options extends Record<string, any> = any> {
  /**
   * Cached mappers metadata
   * @protected
   */
  protected cache = new Map<Type<any> | string, CachedGroupsJsonMapper<Options>>();
  /**
   * Cached executable mappers by his id
   * @protected
   */
  protected mappers: Record<string, JsonMapperCallback<Options>> = {};
  /**
   * Cached schemas
   * @protected
   */
  protected schemes: Record<string, any> = {};

  /**
   * Cached classes by his id
   * @protected
   */
  protected constructors: Record<string, Type<any>> = {};
  /**
   * Global variables available in the mapper
   * @protected
   */
  protected globals: Record<string, any> = {
    isCollection,
    isClass,
    isObject,
    classOf,
    nameOf,
    hasJsonMethod,
    isMongooseObject,
    isNil,
    isDate,
    objectKeys,
    isMomentObject
  };

  constructor() {
    this.addGlobal("alterIgnore", this.alterIgnore.bind(this));
    this.addGlobal("alterValue", this.alterValue.bind(this));
    this.addGlobal("execMapper", this.execMapper.bind(this));
    this.addGlobal("compileAndMap", this.map.bind(this));
  }

  addTypeMapper(model: Type<any> | string, fn: any) {
    const id = nameOf(model);

    this.cache.set(
      model,
      new Map().set("typeMapper", {
        id,
        fn
      })
    );

    this.mappers[id] = fn;

    return this;
  }

  removeTypeMapper(model: Type<any> | string) {
    const store = this.cache.get(model);

    if (store) {
      const {id} = store.get("typeMapper")!;

      delete this.mappers[id];
      this.cache.delete(model);
    }
  }

  addGlobal(key: string, value: any) {
    this.globals[key] = value;

    return this;
  }

  eval(
    mapper: string,
    {
      id,
      groupsId,
      model,
      storeGroups
    }: {
      id: string;
      groupsId: string;
      model: Type<any> | string;
      storeGroups: CachedGroupsJsonMapper<Options>;
    }
  ) {
    const {globals, schemes} = this;

    const injectGlobals = Object.keys(globals)
      .map((name) => {
        return `const ${name} = globals.${name};`;
      })
      .join("\n");

    const compileMapper = new Function(
      "globals",
      "storeGroups",
      "schemes",
      "groupsId",
      "id",
      `${injectGlobals}
      storeGroups.set(groupsId, {id, fn: (${mapper})});
      return storeGroups.get(groupsId);`
    ) as (
      globals: Record<string, any>,
      storeGroups: CachedGroupsJsonMapper<Options>,
      schemes: Record<string, any>,
      groupsId: string,
      id: string
    ) => CachedJsonMapper<Options>;

    const store = compileMapper(globals, storeGroups, schemes, groupsId, id)!;

    this.mappers[id] = store.fn;

    return store;
  }

  createContext(options: Options) {
    const {cache} = this;

    return {
      ...options,
      cache
    };
  }

  compile(
    model: Type<any> | string,
    groups: false | string[],
    opts: {
      mapper?: any;
    } = {}
  ): CachedJsonMapper<Options> {
    const token = isString(model) ? model : this.getType(model);

    const groupsId = this.getGroupsId(groups);
    let storeGroups = this.cache.get(token) || this.cache.get(nameOf(token));

    if (!storeGroups) {
      storeGroups = new Map();
      this.cache.set(token, storeGroups);
    }

    if (storeGroups.has("typeMapper")) {
      return storeGroups.get("typeMapper")!;
    }

    // generate mapper for the given groups
    if (!storeGroups.has(groupsId)) {
      const id = this.getId(token, groupsId);

      // prevent circular dependencies
      storeGroups.set(groupsId, {
        id
      } as any);

      const mapper = opts.mapper ? opts.mapper(id, groups) : this.createMapper(token as Type<any>, id, groups);

      try {
        return this.eval(mapper, {id, groupsId, model: token, storeGroups});
      } catch (err) {
        throw new Error(`Fail to compile mapper for ${nameOf(model)}. See the error above: ${err.message}.\n${mapper}`);
      }
    }

    return storeGroups!.get(groupsId)!;
  }

  protected execMapper(id: string, value: any, options: Options) {
    if (isObjectID(value)) {
      return value.toString();
    }

    return this.mappers[id || nameOf(classOf(value))](value, options);
  }

  protected abstract map(input: any, options: Options): any;

  protected abstract alterValue(schemaId: string, value: any, options: Options): any;

  protected abstract createMapper(model: Type<any>, id: string, groups: false | string[]): string;

  protected getType(model: Type<any>) {
    if (!model) {
      return Object;
    }

    if (isClass(model) && !isCollection(model)) {
      const type = [Array, Map, Set].find((t) => ancestorsOf(model).includes(t));

      if (type) {
        return type;
      }
    }

    return model;
  }

  protected alterIgnore(id: string, options: Options) {
    let result = this.schemes[id]?.$hooks?.alter("ignore", false, [options]);

    if (result) {
      return result;
    }
  }

  protected alterGroups(schema: JsonSchema, groups: false | string[]) {
    if (groups !== false) {
      return schema.$hooks.alter("groups", false, [groups]);
    }

    return false;
  }

  protected getGroupsId(groups: false | string[]) {
    if (groups === false) {
      return "default";
    }

    if (groups.length === 0) {
      return "-";
    }

    return groups.join(",");
  }

  protected getId(model: Type<any> | string, groupsId: string) {
    return `${isString(model) ? model : nameOf(model)}:${getRandomId()}:${groupsId}`;
  }

  protected getSchemaId(id: string, propertyKey: string) {
    return `${id}:${propertyKey}`;
  }
}
