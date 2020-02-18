"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const JsonSchema_1 = require("../class/JsonSchema");
const JSON_SCHEMA_FIELDS = ["additionalItems", "items", "additionalProperties", "properties", "dependencies", "oneOf"];
const toObj = (o) => JSON.parse(JSON.stringify(o));
class JsonSchemaRegistry extends core_1.Registry {
    /**
     *
     * @param {Type<any>} target
     * @param {string} propertyKey
     * @param type
     * @param collectionType
     * @returns {JsonSchema}
     */
    property(target, propertyKey, type, collectionType) {
        if (!this.has(target)) {
            this.merge(target, {
                type: target
            });
            core_1.Store.from(target).set("schema", this.get(target));
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
    static createJsonSchema(schema = new JsonSchema_1.JsonSchema(), type, collectionType) {
        if (core_1.isClass(type)) {
            schema = Object.keys(schema.toObject()).reduce((newSchema, key) => {
                if (!(key === "type" || key === "items" || key === "additionalProperties")) {
                    newSchema[key] = schema[key];
                }
                return newSchema;
            }, JsonSchema_1.JsonSchema.ref(type));
        }
        else {
            schema.type = type;
        }
        if (collectionType) {
            schema.toCollection(collectionType);
        }
        return schema;
    }
    /**
     *
     * @param target
     * @param {string} propertyKey
     * @param value
     */
    required(target, propertyKey, value) {
        const schema = this.get(target) || {};
        const required = schema.required || [];
        if (value !== undefined) {
            const index = required.indexOf(propertyKey);
            if (value && index === -1) {
                schema.required = [].concat(required, [propertyKey]);
            }
            if (!value && index > -1) {
                required.splice(required.indexOf(propertyKey), 1);
            }
        }
        return (schema.required || []).some((p) => p === propertyKey);
    }
    /**
     *
     * @param {Type<any>} target
     * @returns {JSONSchema6}
     */
    getSchemaDefinition(target) {
        return core_1.ancestorsOf(target).reduce((acc, target) => {
            core_1.deepExtends(acc, this.getSchema(target));
            return acc;
        }, {});
    }
    /**
     *
     * @param {Type<any>} target
     * @returns {JSONSchema6}
     */
    getSchema(target) {
        const schemaDefinition = {};
        const schema = this.get(target);
        if (schema) {
            core_1.deepExtends(schemaDefinition, toObj(schema));
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
    findReferences(schema, definitions) {
        if (schema.$ref) {
            return this.getRef(schema, definitions);
        }
        JSON_SCHEMA_FIELDS.forEach((key) => {
            const value = schema[key];
            if (value) {
                if (value.$ref) {
                    return this.getRef(value, definitions);
                }
                Object.keys(value).forEach((index) => {
                    this.findReferences(value[index], definitions);
                });
            }
        });
        return schema;
    }
    /**
     *
     * @param {JSONSchema4} schema
     * @param definitions
     * @returns {JSONSchema4}
     */
    getRef(schema, definitions) {
        const schemaName = this.getRefName(schema.$ref);
        const refSchema = this.getSchemaByName(schemaName);
        if (refSchema) {
            if (!definitions[schemaName]) {
                definitions[schemaName] = {};
                this.findReferences(refSchema, definitions);
                definitions[schemaName] = refSchema.toObject();
            }
        }
        else {
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
    getRefName(ref) {
        return ref.replace("#/definitions/", "");
    }
    /**
     *
     * @param {string} name
     * @returns {JsonSchema}
     */
    getSchemaByName(name) {
        let currentSchema;
        this.forEach(schema => {
            if (schema.refName === name) {
                currentSchema = schema;
            }
        });
        return currentSchema;
    }
}
exports.JsonSchemaRegistry = JsonSchemaRegistry;
// tslint:disable-next-line: variable-name
exports.JsonSchemesRegistry = new JsonSchemaRegistry(JsonSchema_1.JsonSchema);
//# sourceMappingURL=JsonSchemesRegistry.js.map