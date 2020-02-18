"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("../decorators");
const interfaces_1 = require("../interfaces");
const utils_1 = require("../utils");
const Metadata_1 = require("./Metadata");
/**
 * EntityDescription store all information collected by a decorator (class, property key and in option the index of the parameters).
 */
class EntityDescription {
    constructor(_target, propertyKey, index) {
        this._target = _target;
        /**
         * Required entity.
         */
        this.required = false;
        /**
         * Allowed value when the entity is required.
         * @type {Array}
         */
        this.allowedRequiredValues = [];
        if (typeof index === "number") {
            this.index = index;
        }
        this.propertyKey = propertyKey;
        this.target = _target;
    }
    /**
     * Class of the entity.
     * @returns {Type<any>}
     */
    get target() {
        return utils_1.getClass(this._target);
    }
    /**
     *
     * @param {Type<any>} target
     */
    set target(target) {
        this._target = target;
        let type;
        if (typeof this.index === "number") {
            type = Metadata_1.Metadata.getParamTypes(this._target, this.propertyKey)[this.index];
        }
        else {
            type = Metadata_1.Metadata.getType(this._target, this.propertyKey);
        }
        if (utils_1.isCollection(type)) {
            this.collectionType = type;
            this._type = Object;
        }
        else {
            this._type = type;
        }
        this.name = utils_1.nameOf(this.propertyKey);
    }
    /**
     * Return the class name of the entity.
     * @returns {string}
     */
    get targetName() {
        return utils_1.nameOf(this.target);
    }
    /**
     *
     * @returns {Type<any>}
     */
    get type() {
        return this._type;
    }
    /**
     *
     * @param value
     */
    set type(value) {
        this._type = value || Object;
    }
    /**
     *
     * @returns {string}
     */
    get typeName() {
        return utils_1.nameOf(this._type);
    }
    /**
     *
     * @returns {string}
     */
    get collectionName() {
        return this.collectionType ? utils_1.nameOf(this.collectionType) : "";
    }
    /**
     *
     * @returns {boolean}
     */
    get isCollection() {
        return !!this.collectionType;
    }
    /**
     *
     * @returns {boolean}
     */
    get isArray() {
        return utils_1.isArrayOrArrayClass(this.collectionType);
    }
    /**
     *
     * @returns {boolean}
     */
    get isPrimitive() {
        return utils_1.isPrimitiveOrPrimitiveClass(this._type);
    }
    /**
     *
     * @returns {boolean}
     */
    get isDate() {
        return utils_1.isDate(this._type);
    }
    /**
     *
     * @returns {boolean}
     */
    get isObject() {
        return utils_1.isObject(this.type);
    }
    /**
     *
     * @returns {boolean}
     */
    get isClass() {
        return utils_1.isClass(this.type);
    }
    /**
     * Check precondition between value, required and allowedRequiredValues to know if the entity is required.
     * @param value
     * @returns {boolean}
     */
    isRequired(value) {
        return this.required && [undefined, null, ""].indexOf(value) > -1 && this.allowedRequiredValues.indexOf(value) === -1;
    }
}
tslib_1.__decorate([
    decorators_1.Enumerable(),
    tslib_1.__metadata("design:type", String)
], EntityDescription.prototype, "name", void 0);
tslib_1.__decorate([
    decorators_1.NotEnumerable(),
    tslib_1.__metadata("design:type", Number)
], EntityDescription.prototype, "index", void 0);
tslib_1.__decorate([
    decorators_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], EntityDescription.prototype, "propertyKey", void 0);
tslib_1.__decorate([
    decorators_1.Enumerable(),
    tslib_1.__metadata("design:type", interfaces_1.Type)
], EntityDescription.prototype, "collectionType", void 0);
tslib_1.__decorate([
    decorators_1.Enumerable(),
    tslib_1.__metadata("design:type", Boolean)
], EntityDescription.prototype, "required", void 0);
tslib_1.__decorate([
    decorators_1.Enumerable(),
    tslib_1.__metadata("design:type", Array)
], EntityDescription.prototype, "allowedRequiredValues", void 0);
tslib_1.__decorate([
    decorators_1.NotEnumerable(),
    tslib_1.__metadata("design:type", interfaces_1.Type)
], EntityDescription.prototype, "_type", void 0);
exports.EntityDescription = EntityDescription;
//# sourceMappingURL=EntityDescription.js.map