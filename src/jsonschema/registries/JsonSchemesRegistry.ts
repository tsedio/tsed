import {JSONSchema4} from "json-schema";
import {Registry} from "../../core/class/Registry";
import {Store} from "../../core/class/Store";
import {Type} from "../../core/interfaces";
import {ancestorsOf, deepExtends, isArrayOrArrayClass, isClass} from "../../core/utils";
import {JsonSchema} from "../class/JsonSchema";

const JSON_SCHEMA_FIELDS = ["additionalItems", "items", "additionalProperties", "properties", "dependencies", "JSONSchema4"];

const toObj = (o: any) => JSON.parse(JSON.stringify(o));

export class JsonSchemaRegistry extends Registry<any, Partial<JsonSchema>> {
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
                type: target
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
     * @param schema
     * @param type
     * @param collectionType
     */
    private static createJsonSchema(schema: JsonSchema = new JsonSchema, type: any, collectionType?: any): JsonSchema {
        if (isClass(type)) {
            schema = JsonSchema.ref(type);
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
     * @returns {JSONSchema4}
     */
    getSchemaDefinition(target: Type<any>): JSONSchema4 {
        return ancestorsOf(target).reduce((acc: JSONSchema4, target: Type<any>) => {
            deepExtends(acc, this.getSchema(target));
            return acc;
        }, {});
    }

    /**
     *
     * @param {Type<any>} target
     * @returns {JSONSchema4}
     */
    private getSchema(target: Type<any>) {
        const schemaDefinition: JSONSchema4 = {};
        const schema = this.get(target);

        if (schema) {
            deepExtends(schemaDefinition, toObj(schema));
        }

        schemaDefinition.definitions = {};

        this.findReferences(schemaDefinition, schemaDefinition.definitions);

        return schemaDefinition;
    }

    /**
     *
     * @param {JsonSchema} schema
     * @param definitions
     */
    private findReferences(schema: JSONSchema4, definitions: { [p: string]: JSONSchema4 }): JSONSchema4 {
        if (schema.$ref) {
            return this.cleanRef(schema, definitions);
        }

        JSON_SCHEMA_FIELDS.forEach((key: string) => {
            if (schema[key]) {
                const obj = isArrayOrArrayClass(schema[key]) ? [] : {};

                if (schema[key].$ref) {
                    return this.cleanRef(schema[key], definitions);
                }

                schema[key] = Object.keys(schema[key]).reduce((acc: any, index: any) => {
                    schema[key][index] = this.findReferences(schema[key][index], definitions);
                    return schema[key];
                }, obj);
            }
        });

        return schema;
    }

    /**
     *
     * @param {JSONSchema4} schema
     * @param {{[p: string]: JSONSchema4}} definitions
     * @returns {JSONSchema4}
     */
    private cleanRef(schema: JSONSchema4, definitions: { [p: string]: JSONSchema4 }): JSONSchema4 {
        const name = this.getRefName(schema.$ref!);

        const refSchema = this.getSchemaByName(name);
        if (refSchema) {
            definitions[name] = toObj(refSchema);
        } else {
            schema.type = "object";
            delete schema.$ref;
        }
        return schema;
    }

    /**
     *
     * @param {string} ref
     * @returns {string}
     */
    private getRefName(ref: string): string {
        return ref.replace("#/definitions/", "");
    }

    /**
     *
     * @param {string} name
     * @returns {JsonSchema}
     */
    private getSchemaByName(name: string): JsonSchema | undefined {
        let currentSchema;
        this.forEach(schema => {
            if (schema.refName === name) {
                currentSchema = schema;
            }
        });
        return currentSchema;
    }
}

export const JsonSchemesRegistry = new JsonSchemaRegistry(JsonSchema);