"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const JsonSchemesRegistry_1 = require("../registries/JsonSchemesRegistry");
class PropertyMetadata extends core_1.Storable {
    constructor(target, propertyKey) {
        super(target, propertyKey);
        /**
         * Allowed value when the entity is required.
         * @type {Array}
         */
        this.allowedRequiredValues = [];
        this.ignoreProperty = false;
        this.createJsonSchema();
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
        this.createJsonSchema();
    }
    /**
     *
     * @returns {JsonSchema}
     */
    get schema() {
        return this.store.get("schema");
    }
    /**
     * Return the required state.
     * @returns {boolean}
     */
    get required() {
        return JsonSchemesRegistry_1.JsonSchemesRegistry.required(this.target, this.name || this.propertyKey);
    }
    /**
     * Change the state of the required data.
     * @param value
     */
    set required(value) {
        JsonSchemesRegistry_1.JsonSchemesRegistry.required(this.target, this.name || this.propertyKey, value);
    }
    createJsonSchema() {
        this.store.set("schema", JsonSchemesRegistry_1.JsonSchemesRegistry.property(this.target, this.propertyKey, this.type, this.collectionType));
    }
}
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Array)
], PropertyMetadata.prototype, "allowedRequiredValues", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Boolean)
], PropertyMetadata.prototype, "ignoreProperty", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Function)
], PropertyMetadata.prototype, "onSerialize", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Function)
], PropertyMetadata.prototype, "onDeserialize", void 0);
exports.PropertyMetadata = PropertyMetadata;
//# sourceMappingURL=PropertyMetadata.js.map