import {classOf, nameOf, Type} from "@tsed/core";
import {getPropertiesStores, JsonEntityStore, JsonPropertyStore} from "@tsed/schema";
import {alterOnSerialize} from "../hooks/alterOnSerialize";
import {getObjectProperties} from "../utils/getObjectProperties";
import {JsonSerializerOptions} from "../utils/serialize";
import {JsonMapperCompiler} from "./JsonMapperCompiler";
import {Writer} from "./Writer";

export class JsonSerializer extends JsonMapperCompiler<JsonSerializerOptions> {
  constructor() {
    super();

    this.addTypeMapper(Object, (input: any, {type, ...options}: JsonSerializerOptions) => {
      return getObjectProperties(input)
        .filter(([, value]) => value !== undefined)
        .reduce((obj, [key, value]) => {
          const mapper = this.compile(classOf(value));

          return {
            ...obj,
            [key]: mapper.fn(value, options)
          };
        }, {});
    });

    this.addTypeMapper(Array, (input: any, {id, ...options}: JsonSerializerOptions) => {
      return [].concat(input).map((item) => this.mappers[id](item, options));
    });

    this.addTypeMapper(Map, (input: any, {id, ...options}: JsonSerializerOptions) => {
      return [...input.entries()].reduce((obj, [key, item]) => {
        return {
          ...obj,
          [key]: this.mappers[id](item, options)
        };
      }, {});
    });

    this.addTypeMapper(Set, (input: any, {id, ...options}: JsonSerializerOptions) => {
      return [...input.values()].map((item) => {
        return this.mappers[id](item, options);
      });
    });
  }

  alterValue(schemaId: string, value: any, options: JsonSerializerOptions): any {
    return alterOnSerialize(this.schemes[schemaId], value, options as any);
  }

  createMapper(model: Type<any>, id: string): string {
    const entity = JsonEntityStore.from(model);
    const properties = new Set<string>();
    const schemaProperties = [...getPropertiesStores(entity).values()];

    // properties mapping
    const writer = new Writer().arrow("input", "options");

    writer.const("obj", "{}");
    writer.set("options", "{...options, self: input}");

    const propsWriters = schemaProperties.flatMap((propertyStore) => {
      properties.add(propertyStore.propertyKey as string);
      return this.createPropertyMapper(propertyStore, id);
    });

    writer.add(...propsWriters);

    // additional properties
    const additionalProperties = !!entity.schema.get("additionalProperties");

    if (additionalProperties) {
      const exclude = [...properties.values()].map((key) => `'${key}'`).join(", ");

      writer.add("// add additional properties");
      writer.each("options.objectKeys(input)", ["key"]).if(`![${exclude}].includes(key)`).set("obj[key]", "input[key]");
    }

    writer.return("obj");

    return writer.root().toString();
  }

  createPropertyMapper(propertyStore: JsonPropertyStore, id: string) {
    const key = String(propertyStore.propertyKey);
    const aliasKey: string = String(propertyStore.parent.schema.getAliasOf(key) || key);
    const schemaId = `${id}:${key}`;

    let builder = new Writer().add(`// Map ${key}`);

    // ignore hook
    if (propertyStore.schema?.$hooks?.has("ignore")) {
      this.schemes[schemaId] = propertyStore.schema;

      builder = builder.if(`!options.alterIgnore('${schemaId}', {...options, self: input})`);
    }

    builder = builder.add(`let ${key} = input.${key};`).if(`${key} !== undefined`);

    // pre hook
    if (propertyStore.schema?.$hooks?.has("onSerialize")) {
      this.schemes[schemaId] = propertyStore.schema;

      builder.set(key, `options.alterValue('${schemaId}', ${key}, options)`);
    }

    const format = propertyStore.itemSchema.get("format");

    if (propertyStore.isCollection) {
      const type = propertyStore.getBestType();

      const nestedMapper = this.compile(type);

      builder.callMapper(nameOf(propertyStore.collectionType), key, `id: '${nestedMapper.id}'`, format && `format: '${format}'`);
    } else {
      const type = propertyStore.getBestType();
      const nestedMapper = this.compile(type);

      builder.callMapper(nestedMapper.id, key, format && `format: '${format}'`);
    }

    if (aliasKey !== key) {
      builder.if(`options.useAlias`).set(`obj.${aliasKey}`, key).else().set(`obj.${key}`, key);
    } else {
      builder.set(`obj.${key}`, key);
    }

    return builder.root();
  }

  serialize(input: any, options: JsonSerializerOptions = {}) {
    const mapper = this.compile(options.type || classOf(input));

    return mapper.fn(input, serializer.createContext(options));
  }
}

const serializer = new JsonSerializer();

export function serializeV2(input: any, options: JsonSerializerOptions = {}) {
  return serializer.serialize(input, options);
}
