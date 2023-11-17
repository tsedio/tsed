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

export type JsonMapperCallback<Options> = (input: any, options?: Options) => any;
export type CachedJsonMapper<Options> = {
  id: string;
  fn: JsonMapperCallback<Options>;
};

export type CachedGroupsJsonMapper<Options> = Map<string, CachedJsonMapper<Options>>;

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

  eval(mapper: string, {id, groupsId, model}: {id: string; model: Type<any> | string; groupsId: string}) {
    this.addGlobal("cache", this.cache);

    const {globals, schemes} = this;

    const injectGlobals = Object.keys(globals)
      .map((name) => {
        return `const ${name} = globals.${name};`;
      })
      .join("\n");

    eval(`${injectGlobals};

    cache.get(model).set(groupsId, { id: '${id}', fn: ${mapper} })`);

    const store = this.cache.get(model)!.get(groupsId)!;

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
        return this.eval(mapper, {id, model: token, groupsId});
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

    return this.mappers[id](value, options);
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
