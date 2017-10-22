import {JSONSchema4} from "json-schema";
import {ProxyRegistry} from "../../core/class/ProxyRegistry";
import {Registry} from "../../core/class/Registry";
import {Type} from "../../core/interfaces";
import {ancestorsOf, deepExtends, isArrayOrArrayClass, isClass} from "../../core/utils";
import {JsonSchema} from "../class/JsonSchema";
import {Store} from "../../core/class/Store";

const JSON_SCHEMA_FIELDS = ["additionalItems", "items", "additionalProperties", "properties", "dependencies", "JSONSchema4"];


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

        const schemaProperty = schema.properties[propertyKey] || {};
        schema.properties[propertyKey] = this.setPropertyType(schemaProperty, type, collectionType);

        return schema.properties[propertyKey];
    }

    /**
     *
     * @param schema
     * @param type
     * @param collectionType
     */
    private setPropertyType(schema: JsonSchema, type: any, collectionType?: any): JsonSchema {

        delete schema.type;
        delete schema.items;
        delete schema.$ref;
        delete schema.additionalProperties;

        const defineType = (type: any) => {
            return isClass(type) ? JsonSchema.ref(type) : {type: JsonSchema.getJsonType(type)};
        };

        const subSchema = defineType(type);

        if (collectionType) {
            if (isArrayOrArrayClass(collectionType)) {
                schema.type = "array";
                schema.items = subSchema;
            } else {
                schema.additionalProperties = subSchema;
            }
        } else {
            Object.assign(schema, subSchema);
        }

        return schema;
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

        deepExtends(schemaDefinition, schema.toJSON());

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

    private cleanRef(schema: JSONSchema4, definitions: { [p: string]: JSONSchema4 }): JSONSchema4 {
        const name = this.getRefName(schema.$ref!);

        const refSchema = this.getSchemaByName(name);
        if (refSchema) {
            definitions[name] = refSchema.toJSON();
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

export abstract class ProxyJsonSchemesRegistry extends ProxyRegistry<any, JsonSchema> {
    constructor() {
        super(JsonSchemesRegistry);
    }
}
