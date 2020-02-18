"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const index_1 = require("../../converters/constants/index");
const PropertyMetadata_1 = require("../class/PropertyMetadata");
class PropertyRegistry {
    /**
     *
     * @param target
     * @param propertyKey
     * @returns {PropertyMetadata}
     */
    static get(target, propertyKey) {
        const properties = this.getOwnProperties(target);
        if (!properties.has(propertyKey)) {
            this.set(target, propertyKey, new PropertyMetadata_1.PropertyMetadata(target, propertyKey));
        }
        return properties.get(propertyKey);
    }
    /**
     *
     * @param target
     * @param options
     * @returns {Array}
     */
    static getProperties(target, options = {}) {
        const map = new Map();
        const ignored = [];
        core_1.ancestorsOf(target).forEach(klass => {
            this.getOwnProperties(klass).forEach((v, k) => {
                /* istanbul ignore next */
                if (ignored.indexOf(k) !== -1) {
                    return;
                }
                if (options.withIgnoredProps) {
                    map.set(k, v);
                }
                else {
                    if (!v.ignoreProperty) {
                        map.set(k, v);
                    }
                    else {
                        map.delete(k);
                        ignored.push(k);
                    }
                }
            });
        });
        return map;
    }
    /**
     *
     * @param {Type<any>} target
     * @returns {Map<string | symbol, PropertyMetadata>}
     */
    static getOwnProperties(target) {
        const store = core_1.Store.from(target);
        if (!store.has(index_1.PROPERTIES_METADATA)) {
            store.set(index_1.PROPERTIES_METADATA, new Map());
        }
        return store.get(index_1.PROPERTIES_METADATA);
    }
    /**
     *
     * @param target
     * @param propertyKey
     * @param property
     */
    static set(target, propertyKey, property) {
        const properties = this.getOwnProperties(target);
        properties.set(propertyKey, property);
    }
    /**
     *
     * @param target
     * @param propertyKey
     * @param allowedRequiredValues
     * @deprecated
     */
    // istanbul ignore next
    static required(target, propertyKey, allowedRequiredValues = []) {
        const property = this.get(target, propertyKey);
        property.required = true;
        property.allowedRequiredValues = allowedRequiredValues.concat(property.allowedRequiredValues);
        this.set(target, propertyKey, property);
        this.get(target, propertyKey).store.merge("responses", {
            "400": {
                description: "BadRequest"
            }
        });
        return this;
    }
    /**
     *
     * @param {(propertyMetadata: PropertyMetadata, parameters: DecoratorParameters) => void} fn
     * @returns {Function}
     * @deprecated
     */
    // istanbul ignore next
    static decorate(fn) {
        return (...parameters) => {
            const propertyMetadata = PropertyRegistry.get(parameters[0], parameters[1]);
            const result = fn(propertyMetadata, parameters);
            if (typeof result === "function") {
                result(...parameters);
            }
        };
    }
}
tslib_1.__decorate([
    core_1.Deprecated("PropertyRegistry.required is deprecated"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.Type, Object, Array]),
    tslib_1.__metadata("design:returntype", void 0)
], PropertyRegistry, "required", null);
tslib_1.__decorate([
    core_1.Deprecated("PropertyRegistry.decorate is deprecated. Use PropertyFn instead."),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function]),
    tslib_1.__metadata("design:returntype", Function)
], PropertyRegistry, "decorate", null);
exports.PropertyRegistry = PropertyRegistry;
//# sourceMappingURL=PropertyRegistry.js.map