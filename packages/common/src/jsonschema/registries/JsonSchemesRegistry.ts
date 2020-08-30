import {ancestorsOf, deepExtends, isClass, isPrimitiveOrPrimitiveClass, Registry, Store, Type} from "@tsed/core";
import {JSONSchema6} from "json-schema";
import {JsonSchema} from "../class/JsonSchema";
import {getJsonType} from "../utils/getJsonType";

const JSON_SCHEMA_FIELDS = ["additionalItems", "items", "additionalProperties", "properties", "dependencies", "oneOf"];

const toObj = (o: any) => JSON.parse(JSON.stringify(o));

export interface GetSchemaOptions {
  definitions: {[p: string]: JSONSchema6};
}

/**
 * Registry to store all schemes.
 *
 * ::: warning
 * This class will be removed in v6
 * :::
 *
 * @deprecated
 */
export class JsonSchemaRegistry extends Registry<any, Partial<JsonSchema>> {
  /**
   *
   * @param schema
   * @param type
   * @param collectionType
   */
  private static createJsonSchema(schema: JsonSchema = new JsonSchema(), type: any, collectionType?: any): JsonSchema {
    if (isClass(type)) {
      schema = Object.keys(schema.toObject()).reduce((newSchema: any, key: string) => {
        if (!(key === "type" || key === "items" || key === "additionalProperties")) {
          newSchema[key] = schema[key];
        }

        return newSchema;
      }, JsonSchema.ref(type));
    } else {
      schema.type = type;
    }

    if (collectionType) {
      schema.toCollection(collectionType);
    }

    return schema!;
  }

  /**
   *
   * @param {Type<any>} target
   * @param {string} propertyKey
   * @param type
   * @param collectionType
   * @returns {JsonSchema}
   */
  property(target: Type<any>, propertyKey: string, type: any, collectionType?: any): JsonSchema {
    if (!this.has(target)) {
      this.merge(target, {
        type: target,
      });
      Store.from(target).set("schema", this.get(target));
    }

    const schema = this.get(target);
    schema.properties = schema.properties || {};
    schema.properties[propertyKey] = JsonSchemaRegistry.createJsonSchema(schema.properties[propertyKey], type, collectionType);

    return schema.properties[propertyKey];
  }

  /**
   *
   * @param target
   * @param {string} propertyKey
   * @param value
   */
  required(target: any, propertyKey: string, value?: boolean) {
    const schema = this.get(target) || {};
    const required = schema.required || [];

    if (value !== undefined) {
      const index = required.indexOf(propertyKey);
      if (value && index === -1) {
        schema.required = [].concat(required, [propertyKey as never]);
      }
      if (!value && index > -1) {
        required.splice(required.indexOf(propertyKey), 1);
      }
    }

    return (schema.required || []).some((p: string) => p === propertyKey);
  }

  /**
   *
   * @param {Type<any>} target
   * @param options
   * @returns {JSONSchema6}
   */
  getSchemaDefinition(target: Type<any>, options: Partial<GetSchemaOptions> = {}): JSONSchema6 {
    if (isPrimitiveOrPrimitiveClass(target)) {
      return {
        type: getJsonType(target),
      };
    }

    return this.getSchema(target, options);
  }

  /**
   *
   * @param {Type<any>} target
   * @param options
   * @returns {JSONSchema6}
   */
  private getSchema(target: Type<any>, options: Partial<GetSchemaOptions> = {}): JSONSchema6 {
    const {definitions = {}} = options;

    const schema = ancestorsOf(target).reduce((acc: JSONSchema6, target: Type<any>) => {
      const schema = this.has(target) ? toObj(this.get(target)) : {};

      this.findReferences(schema, {...options, definitions});

      deepExtends(acc, schema);

      return acc;
    }, {});

    return {definitions, ...schema};
  }

  /**
   *
   * @param {JsonSchema} schema
   * @param options
   */
  private findReferences(schema: JSONSchema6, options: GetSchemaOptions): JSONSchema6 {
    if (schema.$ref) {
      return this.getRef(schema, options);
    }

    JSON_SCHEMA_FIELDS.forEach((key: string) => {
      const value: any = (schema as any)[key];
      if (value) {
        if (value.$ref) {
          return this.getRef(value, options);
        }

        Object.keys(value).forEach((index: any) => {
          this.findReferences(value[index], options);
        });
      }
    });

    return schema;
  }

  private getRef(schema: JSONSchema6, options: GetSchemaOptions): JSONSchema6 {
    const name = this.getRefName(schema.$ref);

    if (name && !options.definitions[name]) {
      const [target] = this.getSchemaByName(name) || [];

      if (target) {
        options.definitions[name] = {};
        const {definitions, ...refSchema} = this.getSchema(target, options);
        options.definitions[name] = refSchema;
      } else {
        schema.type = "object";
        delete schema.$ref;
      }
    }

    return schema;
  }

  /**
   *
   * @param {string} ref
   * @returns {string}
   */
  private getRefName(ref: string | undefined): string {
    return (ref || "").replace("#/definitions/", "");
  }

  /**
   *
   * @param {string} name
   * @returns {JsonSchema}
   */
  private getSchemaByName(name: string) {
    return Array.from(this.entries()).find(([, schema]) => schema.refName === name);
  }
}

/**
 * @deprecated Will be removed in v6.
 */
// tslint:disable-next-line: variable-name
export const JsonSchemesRegistry = new JsonSchemaRegistry(JsonSchema);
