import {classOf, isArray, isBoolean, isClass, isEmpty, isNil, nameOf, objectKeys, Type} from "@tsed/core";
import {getPropertiesStores, JsonClassStore, JsonEntityStore, JsonParameterStore, JsonPropertyStore} from "@tsed/schema";

import {alterAfterDeserialize} from "../hooks/alterAfterDeserialize.js";
import {alterBeforeDeserialize} from "../hooks/alterBeforeDeserialize.js";
import {alterOnDeserialize} from "../hooks/alterOnDeserialize.js";
import {JsonDeserializerOptions} from "./JsonDeserializerOptions.js";
import {CachedJsonMapper, JsonMapperCompiler} from "./JsonMapperCompiler.js";
import {JsonMapperSettings} from "./JsonMapperSettings.js";
import {getJsonMapperTypes} from "./JsonMapperTypesContainer.js";
import {Writer} from "./Writer.js";

function isDeserializable(obj: any, options: JsonDeserializerOptions) {
  if ((!!options.collectionType && isNil(obj)) || obj === undefined) {
    return false;
  }

  return !(isEmpty(options.type) || (options.type === Object && !options.collectionType));
}

function varKey(k: string) {
  return `__${k}`;
}

function mapParamStoreOptions(store: JsonParameterStore, options: JsonDeserializerOptions) {
  return {
    ...options,
    store: undefined,
    type: store.getBestType(),
    collectionType: store.collectionType,
    groups: store.parameter.groups,
    // genericTypes: store.nestedGenerics[0],
    generics: store.nestedGenerics
  };
}

function getGenericIndex(propertyStore: JsonPropertyStore) {
  return propertyStore.parent.schema.genericLabels.indexOf(propertyStore.itemSchema.genericType);
}

export class JsonDeserializer extends JsonMapperCompiler<JsonDeserializerOptions> {
  /**
   * Cached classes by his id
   * @protected
   */
  protected constructors: Record<string, Type<any>> = {};

  constructor() {
    super();

    this.addGlobal("newInstanceOf", this.newInstanceOf.bind(this));
    this.addGlobal("alterBeforeDeserialize", this.alterBeforeDeserialize.bind(this));
    this.addGlobal("alterAfterDeserialize", this.alterAfterDeserialize.bind(this));

    this.addTypeMapper(Object, this.mapObject.bind(this));
    this.addTypeMapper(Array, this.mapArray.bind(this));
    this.addTypeMapper(Map, this.mapMap.bind(this));
    this.addTypeMapper(Set, this.mapSet.bind(this));
    this.addTypeMapper("ObjectId", (value: any) => String(value));
  }

  map<Model = any>(input: any, options: JsonDeserializerOptions = {}): Model {
    options = this.mapOptions(options);

    if (!isDeserializable(input, options)) {
      return input;
    }

    if (!options.collectionType && isArray(input)) {
      options.collectionType = Array;
    }

    const model = options.type || classOf(input);

    const mapper = this.compile(model, options.groups!);

    if (options.collectionType) {
      const collectionMapper = this.compile(options.collectionType, options.groups!);
      return collectionMapper.fn(input, {...options, id: mapper.id});
    }

    return mapper.fn(input, this.createContext(options));
  }

  compile(model: Type<any>, groups: false | string[]): CachedJsonMapper<JsonDeserializerOptions> {
    if ([WeakMap, WeakSet].includes(model)) {
      throw new Error(`${nameOf(model)} is not supported by JsonMapper.`);
    }

    return super.compile(model, groups);
  }

  eval(
    mapper: string,
    {
      id,
      groupsId,
      model
    }: {
      id: string;
      model: Type<any>;
      groupsId: string;
    }
  ): CachedJsonMapper<JsonDeserializerOptions> {
    this.constructors[id] = model;

    return super.eval(mapper, {id, groupsId, model});
  }

  protected newInstanceOf(id: string, obj: any, options: any) {
    try {
      return new this.constructors[id](options.disableUnsecureConstructor ? {} : obj);
    } catch (er) {
      return obj;
    }
  }

  protected createMapper(model: Type<any>, id: string, groups: false | string[]): string {
    const entity = JsonEntityStore.from(model);
    const properties = new Set<string>();
    const schemaProperties = [...getPropertiesStores(entity).values()];

    const writer = new Writer().arrow("input", "options");

    writer.if("isNil(input)").return("input");

    if (entity.schema.hasDiscriminator) {
      writer.add(this.mapDiscriminator(entity, groups));
    }

    // pre hook
    if (entity.schema.$hooks?.has("beforeDeserialize")) {
      this.schemes[id] = entity.schema;
      writer.set("input", `alterBeforeDeserialize('${id}', input, options)`);
    }

    // generics and options
    writer.const("generics", "options.generics[0]");

    if (entity.schema.genericLabels?.length) {
      writer.set("options", "{...options, self: input, generics: [...options.generics].slice(1)}");
    } else {
      writer.set("options", "{...options, self: input}");
    }

    writer.const("obj", `newInstanceOf('${id}', input, options)`);

    // properties
    writer.add(
      ...schemaProperties.flatMap((propertyStore) => {
        const key = propertyStore.propertyName;

        // TODO V8 add this line: properties.add(key as string);
        properties.add(String(propertyStore.parent.schema.getAliasOf(key) || key));

        if (
          (propertyStore.schema?.$ignore && isBoolean(propertyStore.schema?.$ignore)) ||
          propertyStore.isGetterOnly() ||
          (propertyStore.schema?.$hooks?.has("groups") && this.alterGroups(propertyStore.schema, groups))
        ) {
          return;
        }

        return this.mapProperty(propertyStore, id, groups);
      })
    );

    // additional properties
    writer.add(this.mapAdditionalProperties(entity, properties, groups));

    // post hook
    if (entity.schema.$hooks?.has("afterDeserialize")) {
      this.schemes[id] = entity.schema;

      return writer.return(`alterAfterDeserialize('${id}', obj, options)`).root().toString();
    }

    return writer.return("obj").root().toString();
  }

  protected alterValue(schemaId: string, value: any, options: JsonDeserializerOptions): any {
    return alterOnDeserialize(this.schemes[schemaId], value, options as any);
  }

  private mapDiscriminator(entity: JsonClassStore, groups: false | string[]) {
    const writer = new Writer();
    const discriminator = entity.schema.discriminator();

    const sw = writer.switch(`input['${discriminator.propertyName}']`);

    discriminator.values.forEach((value, kind) => {
      const nestedMapper = this.compile(value, groups);

      sw.case(`'${kind}'`).returnCallMapper(nestedMapper.id, "input");
    });

    return writer;
  }

  private mapProperty(propertyStore: JsonPropertyStore, id: string, groups: false | string[]) {
    const key = String(propertyStore.propertyKey);
    const aliasKey: string = String(propertyStore.parent.schema.getAliasOf(key) || key);
    const schemaId = this.getSchemaId(id, key);
    const format = propertyStore.itemSchema.get("format");
    const formatOpts = format && `options: {format: '${format}'}`;

    let writer = new Writer().add(`// Map ${key} ${id} ${groups || ""}`);
    const pick = key !== aliasKey ? `options.useAlias ? '${aliasKey}' : '${key}'` : `'${key}'`;

    // ignore hook (deprecated)
    if (propertyStore.schema?.$hooks?.has("ignore")) {
      this.schemes[schemaId] = propertyStore.schema;

      writer = writer.if(`!alterIgnore('${schemaId}', {...options, self: input})`);
    }

    // pre hook
    const hasDeserializer = propertyStore.schema?.$hooks?.has("onDeserialize");
    let getter = `input[${pick}]`;

    if (hasDeserializer) {
      this.schemes[schemaId] = propertyStore.schema;
      const opts = Writer.options(formatOpts);

      getter = `alterValue('${schemaId}', input[${pick}], ${opts})`;
    }

    const ifWriter = writer.set(`let ${varKey(key)}`, getter).if(`${varKey(key)} !== undefined`);

    const fill = this.getPropertyFiller(propertyStore, id, groups, formatOpts);

    if (hasDeserializer) {
      fill(ifWriter.if(`${varKey(key)} === input.${key}`));
    } else {
      fill(ifWriter);
    }

    ifWriter.set(`obj.${key}`, varKey(key));

    if (groups && groups.includes("partial")) {
      ifWriter.else().add(`delete obj.${key}`);
    }

    return writer.root();
  }

  private getPropertyFiller(propertyStore: JsonPropertyStore, id: string, groups: false | string[], formatOpts: any) {
    const key = String(propertyStore.propertyKey);
    const schemaId = this.getSchemaId(id, key);
    const generics = propertyStore.itemSchema.nestedGenerics;
    const isGeneric = propertyStore.itemSchema.isGeneric && !generics?.length;

    if (isGeneric) {
      const index = getGenericIndex(propertyStore);
      const opts = Writer.options(formatOpts, `type: generics[${index}]`);

      return (writer: Writer) => writer.set(varKey(key), `compileAndMap(${varKey(key)}, ${opts})`);
    }

    const type = propertyStore.itemSchema.hasDiscriminator ? propertyStore.itemSchema.discriminator().base : propertyStore.getBestType();
    const nestedMapper = this.compile(type, groups);

    if (propertyStore.isCollection) {
      return (writer: Writer) =>
        writer.callMapper(nameOf(propertyStore.collectionType), varKey(key), `id: '${nestedMapper.id}'`, formatOpts);
    }

    if (generics?.length) {
      this.schemes[schemaId] = propertyStore.schema;

      return (writer: Writer) =>
        writer.callMapper(nestedMapper.id, varKey(key), formatOpts, `generics: schemes['${schemaId}'].nestedGenerics`);
    }

    return (writer: Writer) => writer.callMapper(nestedMapper.id, varKey(key), formatOpts);
  }

  private mapOptions({groups, useAlias = true, types, ...options}: JsonDeserializerOptions<any, any>): JsonDeserializerOptions {
    if (options.store instanceof JsonParameterStore) {
      return this.mapOptions(mapParamStoreOptions(options.store, options));
    }

    const customMappers: Record<string, any> = {};
    types = types || getJsonMapperTypes();

    types.forEach((mapper, model) => {
      if (![Array, Set, Map].includes(model as any)) {
        const typeName = nameOf(model);

        if (nameOf(model) in mapper) {
          this.addTypeMapper(model as any, (mapper as any)[typeName].bind(mapper));
        } else {
          this.addTypeMapper(model as any, (value: any, options: any) =>
            mapper.deserialize(value, {
              ...options,
              type: model
            })
          );
        }
      }
    });

    const strictGroups = options.strictGroups ?? JsonMapperSettings.strictGroups;

    return {
      ...options,
      additionalProperties: options.additionalProperties ?? JsonMapperSettings.additionalProperties,
      disableUnsecureConstructor: options.disableUnsecureConstructor ?? JsonMapperSettings.disableUnsecureConstructor,
      groups: groups === undefined ? (strictGroups ? [] : false) : groups || false,
      useAlias,
      customMappers,
      generics: options.generics || []
    };
  }

  private mapAdditionalProperties(entity: JsonClassStore, properties: Set<string>, groups: string[] | false) {
    const additionalProperties = entity.schema.get("additionalProperties");

    const exclude = [...properties.values()].map((key) => `'${key}'`).join(", ");
    const writer = new Writer();

    writer.add("// add additional properties");
    let each = writer.each("objectKeys(input)", ["key"]);

    if (exclude.length) {
      each = each.if(`![${exclude}].includes(key)`);
    }

    if (isClass(additionalProperties)) {
      const nestedMapper = this.compile(additionalProperties.getComputedType(), groups);

      each.set("obj[key]", Writer.mapper(nestedMapper.id, "input[key]", "options"));

      return writer;
    }

    if (additionalProperties) {
      each.set("obj[key]", "input[key]");

      return writer;
    }

    // dynamic additional properties options
    each.if(`options.additionalProperties && obj[key] === undefined`).set("obj[key]", "input[key]");

    return writer;
  }

  private mapObject(input: any, options: JsonDeserializerOptions) {
    return input;
  }

  private mapSet(input: any, options: JsonDeserializerOptions): Set<any> {
    if (isNil(input)) {
      return input;
    }

    const obj = new Set<any>();

    objectKeys(input).forEach((key) => {
      obj.add(this.mapItem(input[key], options));
    });

    return obj;
  }

  private mapArray(input: any, options: JsonDeserializerOptions) {
    if (isNil(input)) {
      return input;
    }

    return [].concat(input).map((item: any) => {
      return this.mapItem(item, options);
    });
  }

  private mapMap(input: any, options: JsonDeserializerOptions): Map<string, any> {
    if (isNil(input)) {
      return input;
    }

    const obj = new Map<string, any>();

    objectKeys(input).forEach((key) => {
      obj.set(key, this.mapItem(input[key], options));
    });

    return obj;
  }

  private mapItem(input: any, {id, ...options}: JsonDeserializerOptions) {
    return this.execMapper(id, input, options);
  }

  private alterBeforeDeserialize(schemaId: string, value: any, options: JsonDeserializerOptions): any {
    return alterBeforeDeserialize(value, this.schemes[schemaId], options);
  }

  private alterAfterDeserialize(schemaId: string, value: any, options: JsonDeserializerOptions): any {
    return alterAfterDeserialize(value, this.schemes[schemaId], options);
  }
}
