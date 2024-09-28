import {
  classOf,
  hasJsonMethod,
  isArray,
  isBoolean,
  isClassObject,
  isCollection,
  isDate,
  isMomentObject,
  isMongooseObject,
  isNil,
  isObject,
  isPrimitive,
  nameOf,
  Type
} from "@tsed/core";
import {getPropertiesStores, JsonClassStore, JsonEntityStore, JsonPropertyStore} from "@tsed/schema";

import {alterOnSerialize} from "../hooks/alterOnSerialize.js";
import {getObjectProperties} from "../utils/getObjectProperties.js";
import {JsonMapperCompiler} from "./JsonMapperCompiler.js";
import {JsonMapperSettings} from "./JsonMapperSettings.js";
import {getJsonMapperTypes} from "./JsonMapperTypesContainer.js";
import {JsonSerializerOptions} from "./JsonSerializerOptions.js";
import {Writer} from "./Writer.js";

const getCollectionType = (input: any) => {
  return isArray(input) ? "Array" : input instanceof Set ? "Set" : input instanceof Map ? "Map" : undefined;
};

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

export class JsonSerializer extends JsonMapperCompiler<JsonSerializerOptions> {
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
    const entity = JsonEntityStore.from(model);
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

  private mapOptions({groups, useAlias = true, types, ...options}: JsonSerializerOptions<any, any>): JsonSerializerOptions {
    const customMappers: Record<string, any> = {};
    types = types || getJsonMapperTypes();

    types.forEach((mapper, model) => {
      if (![Array, Set, Map].includes(model as any)) {
        this.addTypeMapper(model as any, (value: any, options: any) =>
          mapper.serialize(value, {
            ...options,
            type: model
          })
        );
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

    return getObjectProperties(input)
      .filter(([, value]) => value !== undefined)
      .reduce((obj, [key, value]) => {
        if (isNil(value)) {
          return {
            ...obj,
            [key]: value
          };
        }

        const mapper = this.compile(classOf(value), options.groups);

        return {
          ...obj,
          [key]: mapper.fn(value, options)
        };
      }, {});
  }

  private mapSet(input: any, options: JsonSerializerOptions) {
    if (isNil(input)) {
      return input;
    }
    return [...input.values()].map((item) => {
      return this.mapItem(item, options);
    });
  }

  private mapArray(input: any, options: JsonSerializerOptions) {
    if (isNil(input)) {
      return input;
    }

    return [].concat(input).map((item: any) => {
      return this.mapItem(item, options);
    });
  }

  private mapMap(input: any, options: JsonSerializerOptions) {
    if (isNil(input)) {
      return input;
    }

    return [...input.entries()].reduce((obj, [key, item]) => {
      return {
        ...obj,
        [key]: this.mapItem(item, options)
      };
    }, {});
  }

  private mapItem(input: any, {id, ...options}: JsonSerializerOptions) {
    if (!id && input) {
      return this.compile(classOf(input), options.groups).fn(input, options);
    }

    return id ? this.execMapper(id, input, options) : input;
  }

  private mapJSON(input: any, {id, ...options}: JsonSerializerOptions) {
    if (isMongooseObject(input)) {
      return input.toJSON({...options, id});
    }

    id = id || nameOf(classOf(input));

    if (this.mappers[id] && (isDate(input) || isMomentObject(input))) {
      return this.execMapper(id, input, options);
    }

    input = input.toJSON();

    return isObject(input) ? this.execMapper(id, input, options) : input;
  }
}
