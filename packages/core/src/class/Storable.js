"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("../decorators");
const EntityDescription_1 = require("./EntityDescription");
const Store_1 = require("./Store");
/**
 *
 */
class Storable extends EntityDescription_1.EntityDescription {
    constructor(_target, _propertyKey, _index) {
        super(_target, _propertyKey, _index);
        this._store = Store_1.Store.from(_target, _propertyKey, _index);
    }
    /**
     *
     * @returns {Store}
     */
    get store() {
        return this._store;
    }
}
tslib_1.__decorate([
    decorators_1.NotEnumerable(),
    tslib_1.__metadata("design:type", Store_1.Store)
], Storable.prototype, "_store", void 0);
exports.Storable = Storable;
//# sourceMappingURL=Storable.js.map