"use strict";
var ConverterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const di_1 = require("@tsed/di");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const PropertyRegistry_1 = require("../../jsonschema/registries/PropertyRegistry");
const index_1 = require("../constants/index");
const ConverterDeserializationError_1 = require("../errors/ConverterDeserializationError");
const ConverterSerializationError_1 = require("../errors/ConverterSerializationError");
const RequiredPropertyError_1 = require("../errors/RequiredPropertyError");
const UnknownPropertyError_1 = require("../errors/UnknownPropertyError");
let ConverterService = ConverterService_1 = class ConverterService {
    constructor(injectorService, configuration) {
        this.injectorService = injectorService;
        this.validationModelStrict = true;
        this.validationModelStrict = configuration.get("validationModelStrict");
    }
    /**
     * Return a JsonMetadata for a properties.
     * @param properties
     * @param propertyKey
     * @returns {undefined|V|string|any|T|IDBRequest}
     */
    static getPropertyMetadata(properties, propertyKey) {
        if (properties.has(propertyKey)) {
            return properties.get(propertyKey);
        }
        let property;
        properties.forEach(p => {
            if (p.name === propertyKey || p.propertyKey === propertyKey) {
                property = p;
            }
        });
        return property;
    }
    /**
     * Convert instance to plainObject.
     *
     * ### Options
     *
     * - `checkRequiredValue`: Disable the required check condition.
     *
     * @param obj
     * @param options
     */
    serialize(obj, options = {}) {
        try {
            if (core_1.isEmpty(obj)) {
                return obj;
            }
            const converter = this.getConverter(obj);
            const serializer = (o, opt) => this.serialize(o, Object.assign({}, options, opt));
            if (converter && converter.serialize) {
                // deserialize from a custom JsonConverter
                return converter.serialize(obj, serializer);
            }
            if (typeof obj.serialize === "function") {
                // deserialize from serialize method
                return obj.serialize(options, this);
            }
            if (typeof obj.toJSON === "function" && !obj.toJSON.$ignore) {
                // deserialize from serialize method
                return obj.toJSON();
            }
            // Default converter
            if (!core_1.isPrimitiveOrPrimitiveClass(obj)) {
                return this.serializeClass(obj, options);
            }
        }
        catch (err) {
            /* istanbul ignore next */
            throw err.name === "BAD_REQUEST" ? err : new ConverterSerializationError_1.ConverterSerializationError(core_1.getClass(obj), err);
        }
        /* istanbul ignore next */
        return obj;
    }
    /**
     *
     * @param obj
     * @param {IConverterOptions} options
     * @returns {any}
     */
    serializeClass(obj, options = {}) {
        const { checkRequiredValue = true, withIgnoredProps } = options;
        const plainObject = {};
        const properties = PropertyRegistry_1.PropertyRegistry.getProperties(options.type || obj, { withIgnoredProps });
        const keys = properties.size ? Array.from(properties.keys()) : Object.keys(obj);
        keys.forEach(propertyKey => {
            if (typeof obj[propertyKey] !== "function") {
                let propertyMetadata = ConverterService_1.getPropertyMetadata(properties, propertyKey);
                let propertyValue = obj[propertyKey];
                propertyMetadata = propertyMetadata || {};
                propertyValue = this.serialize(propertyValue, {
                    checkRequiredValue,
                    withIgnoredProps,
                    type: propertyMetadata.type
                });
                if (typeof propertyMetadata.onSerialize === "function") {
                    propertyValue = propertyMetadata.onSerialize(propertyValue);
                }
                plainObject[propertyMetadata.name || propertyKey] = propertyValue;
            }
        });
        // Required validation
        if (checkRequiredValue) {
            this.checkRequiredValue(obj, properties);
        }
        return plainObject;
    }
    /**
     * Convert a plainObject to targetType.
     *
     * ### Options
     *
     * - `ignoreCallback`: callback called for each object which will be deserialized. The callback can return a boolean to avoid the default converter behavior.
     * - `checkRequiredValue`: Disable the required check condition.
     *
     * @param obj Object source that will be deserialized
     * @param targetType Pattern of the object deserialized
     * @param baseType
     * @param options
     * @returns {any}
     */
    deserialize(obj, targetType, baseType, options = {}) {
        const { ignoreCallback, checkRequiredValue = true } = options;
        try {
            if (ignoreCallback && ignoreCallback(obj, targetType, baseType)) {
                return obj;
            }
            if (targetType !== Boolean && (core_1.isEmpty(obj) || core_1.isEmpty(targetType) || targetType === Object)) {
                return obj;
            }
            const converter = this.getConverter(targetType);
            const deserializer = (o, targetType, baseType) => this.deserialize(o, targetType, baseType, options);
            if (converter) {
                // deserialize from a custom JsonConverter
                return converter.deserialize(obj, targetType, baseType, deserializer);
            }
            /* istanbul ignore next */
            if (core_1.isArrayOrArrayClass(obj)) {
                const converter = this.getConverter(Array);
                return converter.deserialize(obj, Array, baseType, deserializer);
            }
            if (targetType.prototype && typeof targetType.prototype.deserialize === "function") {
                // deserialize from method
                const instance = new targetType();
                instance.deserialize(obj);
                return instance;
            }
            // Default converter
            const instance = new targetType();
            const properties = PropertyRegistry_1.PropertyRegistry.getProperties(targetType);
            Object.keys(obj).forEach((propertyName) => {
                const propertyMetadata = ConverterService_1.getPropertyMetadata(properties, propertyName);
                return this.convertProperty(obj, instance, propertyName, propertyMetadata, options);
            });
            // Required validation
            if (checkRequiredValue) {
                this.checkRequiredValue(instance, properties);
            }
            return instance;
        }
        catch (err) {
            /* istanbul ignore next */
            throw err.name === "BAD_REQUEST" ? err : new ConverterDeserializationError_1.ConverterDeserializationError(targetType, obj, err);
        }
    }
    /**
     *
     * @param targetType
     * @returns {any}
     */
    getConverter(targetType) {
        if (core_1.Metadata.has(index_1.CONVERTER, targetType)) {
            const converter = core_1.Metadata.get(index_1.CONVERTER, targetType);
            if (converter) {
                return this.injectorService.get(converter);
            }
        }
    }
    /**
     *
     * @param obj
     * @param instance
     * @param {string} propertyName
     * @param {PropertyMetadata} propertyMetadata
     * @param options
     */
    convertProperty(obj, instance, propertyName, propertyMetadata, options) {
        this.checkStrictModelValidation(instance, propertyName, propertyMetadata);
        propertyMetadata = propertyMetadata || {};
        let propertyValue = obj[propertyMetadata.name] || obj[propertyName];
        const propertyKey = propertyMetadata.propertyKey || propertyName;
        try {
            if (typeof instance[propertyKey] !== "function") {
                if (typeof propertyMetadata.onDeserialize === "function") {
                    propertyValue = propertyMetadata.onDeserialize(propertyValue);
                }
                instance[propertyKey] = this.deserialize(propertyValue, propertyMetadata.isCollection ? propertyMetadata.collectionType : propertyMetadata.type, propertyMetadata.type, options);
            }
        }
        catch (err) {
            /* istanbul ignore next */
            (() => {
                const castedErrorMessage = `Error for ${propertyName} with value ${JSON.stringify(propertyValue)} \n ${err.message}`;
                if (err instanceof ts_httpexceptions_1.BadRequest) {
                    throw new ts_httpexceptions_1.BadRequest(castedErrorMessage);
                }
                const castedError = new Error(castedErrorMessage);
                castedError.status = err.status;
                castedError.stack = err.stack;
                castedError.origin = err;
                throw castedError;
            })();
        }
    }
    /**
     *
     * @param instance
     * @param {Map<string | symbol, PropertyMetadata>} properties
     */
    checkRequiredValue(instance, properties) {
        properties.forEach((propertyMetadata) => {
            const value = instance[propertyMetadata.propertyKey];
            if (propertyMetadata.isRequired(value)) {
                throw new RequiredPropertyError_1.RequiredPropertyError(core_1.getClass(instance), propertyMetadata.propertyKey, value);
            }
        });
    }
    /**
     *
     * @param instance
     * @param {string} propertyKey
     * @param {PropertyMetadata | undefined} propertyMetadata
     */
    checkStrictModelValidation(instance, propertyKey, propertyMetadata) {
        if (this.isStrictModelValidation(core_1.getClass(instance)) && propertyMetadata === undefined) {
            throw new UnknownPropertyError_1.UnknownPropertyError(core_1.getClass(instance), propertyKey);
        }
    }
    /**
     *
     * @param {Type<any>} target
     * @returns {boolean}
     */
    isStrictModelValidation(target) {
        if (target !== Object) {
            const modelStrict = core_1.Store.from(target).get("modelStrict");
            if (this.validationModelStrict) {
                return modelStrict === undefined ? true : modelStrict;
            }
            else {
                return modelStrict === true;
            }
        }
        return false;
    }
};
ConverterService = ConverterService_1 = tslib_1.__decorate([
    di_1.Injectable(),
    tslib_1.__param(1, di_1.Configuration()),
    tslib_1.__metadata("design:paramtypes", [di_1.InjectorService, Object])
], ConverterService);
exports.ConverterService = ConverterService;
//# sourceMappingURL=ConverterService.js.map