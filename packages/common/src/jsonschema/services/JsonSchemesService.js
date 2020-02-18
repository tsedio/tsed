"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const di_1 = require("@tsed/di");
const JsonSchemesRegistry_1 = require("../registries/JsonSchemesRegistry");
let JsonSchemesService = class JsonSchemesService extends core_1.ProxyRegistry {
    constructor() {
        super(JsonSchemesRegistry_1.JsonSchemesRegistry);
        this.cache = new Map();
    }
    /**
     *
     * @param {Type<any>} target
     * @returns {JSONSchema4}
     */
    getSchemaDefinition(target) {
        if (!this.cache.has(target)) {
            this.cache.set(target, JsonSchemesRegistry_1.JsonSchemesRegistry.getSchemaDefinition(target));
        }
        return this.cache.get(target);
    }
};
JsonSchemesService = tslib_1.__decorate([
    di_1.Service(),
    tslib_1.__metadata("design:paramtypes", [])
], JsonSchemesService);
exports.JsonSchemesService = JsonSchemesService;
//# sourceMappingURL=JsonSchemesService.js.map