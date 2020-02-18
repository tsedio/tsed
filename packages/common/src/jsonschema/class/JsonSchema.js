"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
/**
 *
 * @type {string[]}
 */
exports.JSON_TYPES = ["string", "number", "integer", "boolean", "object", "array", "null", "any"];
/**
 *
 * @type {string[]}
 */
exports.AUTO_MAP_KEYS = [];
/**
 * Internal use only.
 * @returns {Function}
 * @decorator
 * @private
 * @param target
 * @param propertyKey
 */
function AutoMapKey(target, propertyKey) {
    exports.AUTO_MAP_KEYS.push(propertyKey);
    const descriptor = core_1.descriptorOf(target, propertyKey) || { configurable: true, writable: true };
    descriptor.enumerable = true;
    return descriptor;
}
class JsonSchema {
    constructor() {
        this._proxy = new Proxy(this, {
            set(schema, propertyKey, value) {
                schema.mapValue(propertyKey, value);
                return true;
            }
        });
    }
    /**
     *
     * @returns {JSONSchema6}
     */
    get mapper() {
        return this._proxy;
    }
    /**
     *
     * @returns {any | JSONSchema6TypeName | JSONSchema6TypeName[]}
     */
    get type() {
        return this._type;
    }
    /**
     *
     * @param {any | JSONSchema6TypeName | JSONSchema6TypeName[]} value
     */
    set type(value) {
        if (value) {
            this._refName = core_1.nameOf(value);
            this._type = JsonSchema.getJsonType(value);
        }
        else {
            delete this._refName;
            delete this._type;
        }
    }
    /**
     *
     * @returns {string}
     */
    get refName() {
        return this._refName;
    }
    /**
     *
     * @returns {boolean}
     */
    get isCollection() {
        return this._isCollection;
    }
    /**
     *
     * @returns {boolean}
     */
    get isArray() {
        return this.type === "array";
    }
    /**
     *
     * @returns {"collection" | JSONSchema6TypeName | JSONSchema6TypeName[]}
     */
    get schemaType() {
        if (this.isCollection) {
            if (!this.isArray) {
                return "collection";
            }
        }
        return this.type;
    }
    /**
     *
     * @param value
     * @returns {JSONSchema6TypeName | JSONSchema6TypeName[]}
     */
    static getJsonType(value) {
        if (core_1.isPrimitiveOrPrimitiveClass(value)) {
            if (exports.JSON_TYPES.indexOf(value) > -1) {
                return value;
            }
            return core_1.primitiveOf(value);
        }
        if (core_1.isArrayOrArrayClass(value)) {
            if (value !== Array) {
                return value;
            }
            return "array";
        }
        if (core_1.isDate(value)) {
            return "string";
        }
        return "object";
    }
    /**
     *
     * @param type
     * @returns {JSONSchema6}
     */
    static ref(type) {
        const schema = new JsonSchema();
        schema.$ref = `#/definitions/${core_1.nameOf(type)}`;
        return schema;
    }
    /**
     * Write value on the right place according to the schema type
     */
    mapValue(key, value) {
        switch (this.schemaType) {
            case "collection":
                this.additionalProperties[key] = value;
                break;
            case "array":
                this.items[key] = value;
                break;
            default:
                this[key] = value;
        }
    }
    /**
     *
     * @param collectionType
     */
    toCollection(collectionType) {
        this._isCollection = true;
        if (core_1.isArrayOrArrayClass(collectionType)) {
            this.items = this.items || new JsonSchema();
            this.items.type = this._type;
            this._type = "array";
            this.forwardKeysTo(this, "items");
        }
        else {
            this.additionalProperties = new JsonSchema();
            this.additionalProperties.type = this._type;
            delete this._type;
            this.forwardKeysTo(this, "additionalProperties");
        }
    }
    /**
     *
     * @returns {{}}
     */
    toJSON() {
        const obj = {};
        for (const key in this) {
            if (!key.match(/^_/) && typeof this[key] !== "function") {
                const value = this[key];
                if (value !== undefined) {
                    if (value instanceof JsonSchema) {
                        obj[key] = value.toJSON();
                    }
                    else {
                        obj[key] = value;
                    }
                }
            }
        }
        return obj;
    }
    toObject() {
        return JSON.parse(JSON.stringify(this.toJSON()));
    }
    /**
     *
     * @param obj
     */
    merge(obj) {
        core_1.deepExtends(this, obj);
        return this;
    }
    /**
     *
     * @param instance
     * @param {string} property
     */
    forwardKeysTo(instance, property) {
        exports.AUTO_MAP_KEYS.forEach(key => {
            if (instance[key]) {
                instance[property][key] = instance[key];
                delete instance[key];
            }
        });
    }
}
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", String)
], JsonSchema.prototype, "$id", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", String)
], JsonSchema.prototype, "id", void 0);
tslib_1.__decorate([
    AutoMapKey,
    tslib_1.__metadata("design:type", String)
], JsonSchema.prototype, "$ref", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], JsonSchema.prototype, "$schema", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", String)
], JsonSchema.prototype, "title", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", String)
], JsonSchema.prototype, "description", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], JsonSchema.prototype, "default", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], JsonSchema.prototype, "additionalItems", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", JsonSchema)
], JsonSchema.prototype, "items", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Number)
], JsonSchema.prototype, "maxItems", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Number)
], JsonSchema.prototype, "minItems", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Boolean)
], JsonSchema.prototype, "uniqueItems", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Number)
], JsonSchema.prototype, "maxProperties", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Number)
], JsonSchema.prototype, "minProperties", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], JsonSchema.prototype, "required", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], JsonSchema.prototype, "properties", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", JsonSchema)
], JsonSchema.prototype, "additionalProperties", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], JsonSchema.prototype, "definitions", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], JsonSchema.prototype, "patternProperties", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], JsonSchema.prototype, "dependencies", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Array)
], JsonSchema.prototype, "allOf", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Array)
], JsonSchema.prototype, "anyOf", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Array)
], JsonSchema.prototype, "oneOf", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], JsonSchema.prototype, "not", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], JsonSchema.prototype, "extends", void 0);
tslib_1.__decorate([
    AutoMapKey,
    tslib_1.__metadata("design:type", Number)
], JsonSchema.prototype, "multipleOf", void 0);
tslib_1.__decorate([
    AutoMapKey,
    tslib_1.__metadata("design:type", Number)
], JsonSchema.prototype, "maximum", void 0);
tslib_1.__decorate([
    AutoMapKey,
    tslib_1.__metadata("design:type", Number)
], JsonSchema.prototype, "exclusiveMaximum", void 0);
tslib_1.__decorate([
    AutoMapKey,
    tslib_1.__metadata("design:type", Number)
], JsonSchema.prototype, "minimum", void 0);
tslib_1.__decorate([
    AutoMapKey,
    tslib_1.__metadata("design:type", Number)
], JsonSchema.prototype, "exclusiveMinimum", void 0);
tslib_1.__decorate([
    AutoMapKey,
    tslib_1.__metadata("design:type", Number)
], JsonSchema.prototype, "maxLength", void 0);
tslib_1.__decorate([
    AutoMapKey,
    tslib_1.__metadata("design:type", Number)
], JsonSchema.prototype, "minLength", void 0);
tslib_1.__decorate([
    AutoMapKey,
    tslib_1.__metadata("design:type", String)
], JsonSchema.prototype, "pattern", void 0);
tslib_1.__decorate([
    AutoMapKey,
    tslib_1.__metadata("design:type", String)
], JsonSchema.prototype, "format", void 0);
tslib_1.__decorate([
    AutoMapKey,
    tslib_1.__metadata("design:type", Array)
], JsonSchema.prototype, "enum", void 0);
tslib_1.__decorate([
    core_1.NotEnumerable(),
    tslib_1.__metadata("design:type", String)
], JsonSchema.prototype, "_refName", void 0);
tslib_1.__decorate([
    core_1.NotEnumerable(),
    tslib_1.__metadata("design:type", Boolean)
], JsonSchema.prototype, "_isCollection", void 0);
tslib_1.__decorate([
    core_1.NotEnumerable(),
    tslib_1.__metadata("design:type", Object)
], JsonSchema.prototype, "_type", void 0);
tslib_1.__decorate([
    core_1.NotEnumerable(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [])
], JsonSchema.prototype, "mapper", null);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], JsonSchema.prototype, "type", null);
exports.JsonSchema = JsonSchema;
//# sourceMappingURL=JsonSchema.js.map