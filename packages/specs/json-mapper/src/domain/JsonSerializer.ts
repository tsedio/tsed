import {
  classOf,
  hasJsonMethod,
  isClassObject,
  isCollection,
  isDate,
  isMomentObject,
  isMongooseObject,
  isNil,
  isObject,
  nameOf,
  Type
} from "@tsed/core";
import {getPropertiesStores, JsonClassStore, JsonEntityStore, JsonPropertyStore} from "@tsed/schema";
import {alterOnSerialize} from "../hooks/alterOnSerialize";
import {getObjectProperties} from "../utils/getObjectProperties";
import {JsonMapperCompiler} from "./JsonMapperCompiler";
import {getJsonMapperTypes} from "./JsonMapperTypesContainer";
import {JsonSerializerOptions} from "./JsonSerializerOptions";
import {Writer} from "./Writer";

function getBestType(type: Type<any>, obj: any) {
  const dataType = classOf(obj);

  if (dataType && !isClassObject(dataType)) {
    return dataType;
  }

  return type || Object;
}

export class JsonSerializer extends JsonMapperCompiler<JsonSerializerOptions> {
  constructor() {
    super();

    this.addTypeMapper(Object, this.mapObject.bind(this));
    this.addTypeMapper(Array, this.mapArray.bind(this));
    this.addTypeMapper(Map, this.mapMap.bind(this));
    this.addTypeMapper(Set, this.mapSet.bind(this));
    this.addGlobal("mapJSON", this.mapJSON.bind(this));
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
      return writer.return("input").root().toString();
    }

    // properties
    writer.add(
      ...schemaProperties.flatMap((propertyStore) => {
        properties.add(propertyStore.propertyKey as string);

        if (propertyStore.schema?.$hooks?.has("groups") && this.alterGroups(propertyStore.schema, groups)) {
          return;
        }

        return this.mapProperty(propertyStore, id, groups);
      })
    );

    // discriminator
    writer.add(this.mapDiscriminator(entity));

    // additional properties
    writer.add(this.mapAdditionalProperties(entity, properties));

    return writer.return("obj").root().toString();
  }

  private mapOptions({groups = false, useAlias = true, types, ...options}: JsonSerializerOptions<any, any>): JsonSerializerOptions {
    const customMappers: Record<string, any> = {};
    types = types || getJsonMapperTypes();

    types.forEach((mapper, model) => {
      if (![Array, Set, Map].includes(model as any)) {
        this.addTypeMapper(model as any, mapper.serialize.bind(mapper));
      }
    });

    return {
      ...options,
      groups,
      useAlias,
      customMappers
    };
  }

  private mapProperty(propertyStore: JsonPropertyStore, id: string, groups: false | string[]) {
    const key = String(propertyStore.propertyKey);
    const aliasKey: string = String(propertyStore.parent.schema.getAliasOf(key) || key);
    const schemaId = `${id}:${key}`;

    let writer = new Writer().add(`// Map ${key} ${id} ${groups || ""}`);

    // ignore hook (deprecated)
    if (propertyStore.schema?.$hooks?.has("ignore")) {
      this.schemes[schemaId] = propertyStore.schema;

      writer = writer.if(`!alterIgnore('${schemaId}', {...options, self: input})`);
    }

    writer = writer.add(`let ${key} = input.${key};`).if(`${key} !== undefined`);

    const format = propertyStore.itemSchema.get("format");
    const formatOpts = format && `options: {format: '${format}'}`;

    // pre hook
    const hasSerializer = propertyStore.schema?.$hooks?.has("onSerialize");
    if (hasSerializer) {
      this.schemes[schemaId] = propertyStore.schema;
      const opts = Writer.options(formatOpts);

      writer.set(key, `alterValue('${schemaId}', ${key}, ${opts})`);
    }

    if (propertyStore.isCollection) {
      const type = propertyStore.getBestType();

      const nestedMapper = this.compile(type, groups);

      writer.callMapper(nameOf(propertyStore.collectionType), key, `id: '${nestedMapper.id}'`, formatOpts);
    } else {
      const type = propertyStore.getBestType();
      const nestedMapper = this.compile(type, groups);

      const fill = (writer: Writer) => writer.callMapper(nestedMapper.id, key, formatOpts);

      if (hasSerializer) {
        fill(writer.if(`${key} === input.${key}`));
      } else {
        fill(writer);
      }
    }

    if (aliasKey !== key) {
      writer.set(`obj[options.useAlias ? '${aliasKey}' : '${key}']`, key);
    } else {
      writer.set(`obj.${key}`, key);
    }

    return writer.root();
  }

  private mapPrecondition(id: string) {
    const writer = new Writer();

    writer.if("input && isCollection(input)").return(Writer.mapperFrom("input", `{...options, id: '${id}'}`));

    writer.if("hasJsonMethod(input)").return(`mapJSON(input, {...options, id: '${id}'})`);

    return writer;
  }

  private mapDiscriminator(entity: JsonClassStore) {
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
    if (input && isCollection(input)) {
      return this.execMapper(nameOf(classOf(input)), input, options);
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
    return [...input.values()].map((item) => {
      return this.mapItem(item, options);
    });
  }

  private mapArray(input: any, options: JsonSerializerOptions) {
    return [].concat(input).map((item: any) => {
      return this.mapItem(item, options);
    });
  }

  private mapMap(input: any, options: JsonSerializerOptions) {
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
