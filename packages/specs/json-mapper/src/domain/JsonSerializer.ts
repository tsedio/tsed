import {JsonClassStore, JsonPropertyStore, getPropertiesStores, s} from "@tsed/schema";
import {
  Type,
  classOf,
  hasJsonMethod,
  isArray,
  isBoolean,
  isClassObject,
  isCollection,
  isDate,
  isFunction,
  isMomentObject,
  isMongooseObject,
  isNil,
  isObject,
  isPrimitive,
  nameOf
} from "@tsed/core";
import {DateMapper} from "../components/DateMapper.js";
import {PrimitiveMapper} from "../components/PrimitiveMapper.js";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";
import {JsonMapperCompiler, JsonMapperCallback} from "./JsonMapperCompiler.js";
import {JsonMapperSettings} from "./JsonMapperSettings.js";
import {JsonSerializerOptions} from "./JsonSerializerOptions.js";
import {Writer} from "./Writer.js";
import {alterOnSerialize} from "../hooks/alterOnSerialize.js";
import {getJsonMapperTypes} from "./JsonMapperTypesContainer.js";

const getCollectionType = (input: any) => {
  return isArray(input) ? "Array" : input instanceof Set ? "Set" : input instanceof Map ? "Map" : undefined;
};

/**
 * Assign a mapped value on a plain output object. A `__proto__` key is defined as an own property:
 * a plain assignment would call the `__proto__` setter, change the prototype and drop the key.
 */
function setKey(obj: any, key: any, value: any) {
  if (key === "__proto__") {
    Object.defineProperty(obj, key, {value, enumerable: true, writable: true, configurable: true});
  } else {
    obj[key] = value;
  }
}

function getBestType(type: Type<any>, obj: any) {
  const dataType = classOf(obj);

  if (dataType && !isClassObject(dataType) && !isCollection(obj)) {
    return dataType;
  }

  return type || Object;
}

function varKey(k: string) {
  return `__${k}`;
}

type TypeMapperEntry = {mapper: JsonMapperMethods; name: string; serialize: any; conversion: any; fn: JsonMapperCallback<any>};

/**
 * The function a type mapper is registered with. The built-in Date and primitive mappers do not read the
 * context, so they are called without building one: a copy of the options for every Date, string and number
 * the payload holds was most of the time of a serialization.
 */
function createTypeMapper(mapper: JsonMapperMethods, model: any, name: string): JsonMapperCallback<any> {
  const kind: any = mapper.constructor;
  const conversion = (mapper as any)[name];

  if (
    kind === PrimitiveMapper &&
    mapper.serialize === PrimitiveMapper.prototype.serialize &&
    isFunction(conversion) &&
    conversion === (PrimitiveMapper.prototype as any)[name]
  ) {
    // inline typeof on purpose: this runs for every primitive value, and calling isObject() here was ~15% slower on the serializer benchmark
    return (value: any) => (typeof value !== "object" ? conversion.call(mapper, value) : value);
  }

  if (kind === DateMapper && mapper.serialize === DateMapper.prototype.serialize) {
    return (value: any) => (mapper as DateMapper).serialize(value);
  }

  return (value: any, options: any) =>
    mapper.serialize(value, {
      ...options,
      type: model
    });
}

/**
 * Serializes data structures according to the metadata captured by `@tsed/schema`.
 *
 * The serializer walks entity schemas, applies hooks, honors alias/group rules, and falls back to the
 * registered type mappers (e.g., components in `src/components`).
 */
export class JsonSerializer extends JsonMapperCompiler<JsonSerializerOptions> {
  /**
   * The type mappers registered from the types container, with the function each one was registered with
   * @protected
   */
  protected typeMappers = new Map<any, TypeMapperEntry>();

  constructor() {
    super();

    this.addTypeMapper(Object, this.mapObject.bind(this));
    this.addTypeMapper(Array, this.mapArray.bind(this));
    this.addTypeMapper(Map, this.mapMap.bind(this));
    this.addTypeMapper(Set, this.mapSet.bind(this));
    this.addGlobal("mapJSON", this.mapJSON.bind(this));
    this.addTypeMapper("ObjectId", (value: any) => String(value));
  }

  map(input: any, options: JsonSerializerOptions = {}) {
    if (isNil(input)) {
      return input;
    }

    options = this.mapOptions(options);

    const model = getBestType(options.type, input);

    const mapper = this.compile(model, options.groups);

    return mapper.fn(input, this.createContext(options));
  }

  protected alterValue(schemaId: string, value: any, options: JsonSerializerOptions): any {
    return alterOnSerialize(this.schemes[schemaId], value, options as any);
  }

  protected createMapper(model: Type<any>, id: string, groups: false | string[]): string {
    const entity = s.store(model);
    const properties = new Set<string>();
    const schemaProperties = [...getPropertiesStores(entity).values()];

    const writer = new Writer().arrow("input", "options");

    writer.if("isNil(input)").return("input");

    // prepare options
    writer.const("obj", "{}");
    writer.set("options", "{...options, self: input}");

    // detect some special case
    writer.add(this.mapPrecondition(id));

    if (!schemaProperties.length) {
      return writer.return("isObject(input) ? {...input} : input").root().toString();
    }

    // properties
    writer.add(
      ...schemaProperties.flatMap((propertyStore) => {
        properties.add(propertyStore.propertyKey as string);

        if (
          (propertyStore.schema?.$ignore && isBoolean(propertyStore.schema?.$ignore)) ||
          (propertyStore.schema?.$hooks?.has("groups") && this.alterGroups(propertyStore.schema, groups))
        ) {
          return;
        }

        return this.mapProperty(propertyStore, id, groups);
      })
    );

    // discriminator
    writer.add(this.mapDiscriminatorKeyValue(entity));

    // additional properties
    writer.add(this.mapAdditionalProperties(entity, properties));

    return writer.return("obj").root().toString();
  }

  /**
   * A type mapper must be registered again when it was never registered, when the mapper or one of the
   * methods its function was built from changed, or when its entry was replaced or removed from the cache.
   */
  private isTypeMapperOutdated(model: any, mapper: JsonMapperMethods) {
    const registered = this.typeMappers.get(model);

    if (!registered) {
      return true;
    }

    const mapperChanged = registered.mapper !== mapper;
    const methodsChanged = registered.serialize !== mapper.serialize || registered.conversion !== (mapper as any)[registered.name];
    const entryReplaced = this.cache.get(model)?.get("typeMapper")?.fn !== registered.fn;

    return mapperChanged || methodsChanged || entryReplaced;
  }

  private mapOptions({groups, useAlias = true, types, ...options}: JsonSerializerOptions<any, any>): JsonSerializerOptions {
    const customMappers: Record<string, any> = {};
    types = types || getJsonMapperTypes();

    types.forEach((mapper, model) => {
      if (![Array, Set, Map].includes(model as any) && this.isTypeMapperOutdated(model, mapper)) {
        const name = nameOf(model);
        const fn = createTypeMapper(mapper, model, name);

        this.addTypeMapper(model as any, fn);
        this.typeMappers.set(model, {mapper, name, serialize: mapper.serialize, conversion: (mapper as any)[name], fn});
      }
    });

    const strictGroups = options.strictGroups ?? JsonMapperSettings.strictGroups;

    return {
      ...options,
      groups: groups === undefined ? (strictGroups ? [] : false) : groups || false,
      useAlias,
      customMappers
    };
  }

  private mapProperty(propertyStore: JsonPropertyStore, id: string, groups: false | string[]) {
    const key = String(propertyStore.propertyKey);
    const aliasKey: string = String(propertyStore.parent.schema.getAliasOf(key) || key);
    const schemaId = this.getSchemaId(id, key);
    const format = propertyStore.itemSchema.get("format");
    const formatOpts = format && `options: {format: '${format}'}`;

    let writer = new Writer().add(`// Map ${key} ${id} ${groups || ""}`);

    // ignore hook (deprecated)
    if (propertyStore.schema?.$hooks?.has("ignore")) {
      this.schemes[schemaId] = propertyStore.schema;

      writer = writer.if(`!alterIgnore('${schemaId}', {...options, self: input})`);
    }

    // pre hook
    const hasSerializer = propertyStore.schema?.$hooks?.has("onSerialize");
    let getter = `input.${key}`;

    if (hasSerializer) {
      this.schemes[schemaId] = propertyStore.schema;
      const opts = Writer.options(formatOpts);

      getter = `alterValue('${schemaId}', input.${key}, ${opts})`;
    }

    writer = writer.set(`let ${varKey(key)}`, getter).if(`${varKey(key)} !== undefined`);

    const fill = this.getPropertyFiller(propertyStore, key, groups, formatOpts);

    if (hasSerializer) {
      fill(writer.if(`${varKey(key)} === input.${key}`));
    } else {
      fill(writer);
    }

    if (aliasKey !== key) {
      writer.set(`obj[options.useAlias ? '${aliasKey}' : '${key}']`, varKey(key));
    } else {
      writer.set(`obj.${key}`, varKey(key));
    }

    return writer.root();
  }

  private getPropertyFiller(propertyStore: JsonPropertyStore, key: string, groups: false | string[], formatOpts: any) {
    const isGeneric = propertyStore.itemSchema.isGeneric;
    const hasDiscriminator = propertyStore.itemSchema.hasDiscriminator;

    if (propertyStore.isCollection) {
      const type = propertyStore.getBestType();
      let nestedMapper: any;

      if (hasDiscriminator) {
        const targetName = propertyStore.parent.targetName;

        nestedMapper = this.compile(`Discriminator:${targetName}:${key}`, groups, {
          mapper: () => this.createDiscriminatorMapper(propertyStore, groups)
        });
      } else {
        nestedMapper = isGeneric ? {id: ""} : this.compile(type, groups);
      }

      return (writer: Writer) =>
        writer.callMapper(nameOf(propertyStore.collectionType), varKey(key), `id: '${nestedMapper.id}'`, formatOpts);
    }

    if (isGeneric) {
      return (writer: Writer) => writer.set(varKey(key), `compileAndMap(${varKey(key)}, options)`);
    }

    let nestedMapper: any;
    if (hasDiscriminator) {
      const targetName = propertyStore.parent.targetName;

      nestedMapper = this.compile(`Discriminator:${targetName}:${key}`, groups, {
        mapper: () => this.createDiscriminatorMapper(propertyStore, groups)
      });
    } else {
      nestedMapper = this.compile(propertyStore.getBestType(), groups);
    }

    return (writer: Writer) => writer.callMapper(nestedMapper.id, varKey(key), formatOpts);
  }

  private createDiscriminatorMapper(propertyStore: JsonPropertyStore, groups: false | string[]) {
    const discriminator = propertyStore.itemSchema.discriminator();
    const writer = new Writer().arrow("input", "options");

    const sw = writer.switch(`nameOf(classOf(input))`);

    discriminator.values.forEach((value, kind) => {
      const nestedMapper = this.compile(value, groups);

      sw.case(`'${nameOf(value)}'`).returnCallMapper(nestedMapper.id, "input");
    });

    return writer.root().toString();
  }

  private mapPrecondition(id: string) {
    const writer = new Writer();

    writer.if("input && isCollection(input)").return(Writer.mapperFrom("input", `{...options, id: '${id}'}`));

    writer.if("hasJsonMethod(input)").return(`mapJSON(input, {...options, id: '${id}'})`);

    return writer;
  }

  private mapDiscriminatorKeyValue(entity: JsonClassStore) {
    if (entity.discriminatorAncestor) {
      const discriminator = entity.discriminatorAncestor.schema.discriminator();
      const type = discriminator.getDefaultValue(entity.target);

      if (type) {
        const writer = new Writer();
        writer.if(`!obj.${discriminator.propertyName}`).set(`obj.${discriminator.propertyName}`, `'${type}'`);

        return writer;
      }
    }
  }

  private mapAdditionalProperties(entity: JsonClassStore, properties: Set<string>) {
    const additionalProperties = !!entity.schema.get("additionalProperties");

    if (additionalProperties) {
      const exclude = [...properties.values()].map((key) => `'${key}'`).join(", ");
      const writer = new Writer();
      writer.add("// add additional properties");
      writer.each("objectKeys(input)", ["key"]).if(`![${exclude}].includes(key)`).set("obj[key]", "input[key]");

      return writer;
    }
  }

  private mapObject(input: any, {type, ...options}: JsonSerializerOptions) {
    if ((input && isPrimitive(input)) || !input) {
      // prevent mongoose mapping error
      return input;
    }

    if (input && isCollection(input)) {
      return this.execMapper(getCollectionType(input)!, input, options);
    }

    if (hasJsonMethod(input)) {
      return this.mapJSON(input, options);
    }

    const obj: any = {};

    // own enumerable keys only, like Object.entries(); functions and undefined values are skipped
    for (const key in input) {
      if (!Object.hasOwn(input, key)) {
        continue;
      }

      const value = input[key];

      if (value === undefined || isFunction(value)) {
        continue;
      }

      setKey(obj, key, value === null ? value : this.compile(classOf(value), options.groups).fn(value, options));
    }

    return obj;
  }

  // The collection mappers strip `id` from the options once, not once per item:
  // `id` describes the items, it must not leak into the options of a nested object mapper.
  private mapSet(input: any, {id, ...options}: JsonSerializerOptions) {
    if (isNil(input)) {
      return input;
    }

    const out: any[] = [];

    for (const item of input) {
      out.push(this.mapItem(item, id, options));
    }

    return out;
  }

  private mapArray(input: any, {id, ...options}: JsonSerializerOptions) {
    if (isNil(input)) {
      return input;
    }

    // a single value is mapped as a one-item array, like the former [].concat(input)
    const list = isArray(input) ? input : [input];
    const out = new Array(list.length);

    for (let i = 0; i < list.length; i++) {
      out[i] = this.mapItem(list[i], id, options);
    }

    return out;
  }

  private mapMap(input: any, {id, ...options}: JsonSerializerOptions) {
    if (isNil(input)) {
      return input;
    }

    const obj: any = {};

    for (const [key, item] of input) {
      setKey(obj, key, this.mapItem(item, id, options));
    }

    return obj;
  }

  private mapItem(input: any, id: string | undefined, options: JsonSerializerOptions) {
    if (!id && input) {
      return this.compile(classOf(input), options.groups).fn(input, options);
    }

    return id ? this.execMapper(id, input, options) : input;
  }

  private mapJSON(input: any, {id, ...options}: JsonSerializerOptions) {
    if (isMongooseObject(input)) {
      return input.toJSON({...options, self: undefined, id});
    }

    id = id || nameOf(classOf(input));

    if (this.mappers[id] && (isDate(input) || isMomentObject(input))) {
      return this.execMapper(id, input, options);
    }

    input = input.toJSON();

    return isObject(input) ? this.execMapper(id, input, options) : input;
  }
}
