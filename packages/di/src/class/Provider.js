"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const interfaces_1 = require("../interfaces");
const ProviderType_1 = require("../interfaces/ProviderType");
class Provider {
    constructor(token) {
        this.root = false;
        this.type = ProviderType_1.ProviderType.PROVIDER;
        this.injectable = true;
        this.provide = token;
        this.useClass = token;
    }
    get token() {
        return this._provide;
    }
    get provide() {
        return this._provide;
    }
    set provide(value) {
        if (value) {
            this._provide = core_1.isClass(value) ? core_1.classOf(value) : value;
            this._store = core_1.Store.from(value);
        }
    }
    get useClass() {
        return this._useClass;
    }
    /**
     * Create a new store if the given value is a class. Otherwise the value is ignored.
     * @param value
     */
    set useClass(value) {
        if (core_1.isClass(value)) {
            this._useClass = core_1.classOf(value);
            this._store = core_1.Store.from(value);
        }
    }
    get className() {
        return this.name;
    }
    get name() {
        return core_1.nameOf(this.provide);
    }
    get store() {
        return this._store;
    }
    /**
     * Get the scope of the provider.
     *
     * ::: tip Note
     * Async provider is always a SINGLETON
     * :::
     *
     * @returns {boolean}
     */
    get scope() {
        if (this.isAsync()) {
            return interfaces_1.ProviderScope.SINGLETON;
        }
        return this.store.get("scope");
    }
    /**
     * Change the scope value of the provider.
     * @param scope
     */
    set scope(scope) {
        this.store.set("scope", scope);
    }
    get configuration() {
        return this.store.get("configuration");
    }
    set configuration(configuration) {
        this.store.set("configuration", configuration);
    }
    isAsync() {
        return !!this.useAsyncFactory;
    }
    clone() {
        const provider = new (core_1.classOf(this))(this.token);
        core_1.getKeys(this).forEach(key => {
            if (this[key] !== undefined) {
                provider[key] = this[key];
            }
        });
        return provider;
    }
    toString() {
        return `Token:${this.name}`;
    }
}
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Boolean)
], Provider.prototype, "root", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], Provider.prototype, "type", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Boolean)
], Provider.prototype, "injectable", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], Provider.prototype, "instance", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Array)
], Provider.prototype, "deps", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Array)
], Provider.prototype, "imports", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Function)
], Provider.prototype, "useFactory", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Function)
], Provider.prototype, "useAsyncFactory", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object)
], Provider.prototype, "useValue", void 0);
tslib_1.__decorate([
    core_1.NotEnumerable(),
    tslib_1.__metadata("design:type", Object)
], Provider.prototype, "_provide", void 0);
tslib_1.__decorate([
    core_1.NotEnumerable(),
    tslib_1.__metadata("design:type", core_1.Type)
], Provider.prototype, "_useClass", void 0);
tslib_1.__decorate([
    core_1.NotEnumerable(),
    tslib_1.__metadata("design:type", Object)
], Provider.prototype, "_instance", void 0);
tslib_1.__decorate([
    core_1.NotEnumerable(),
    tslib_1.__metadata("design:type", core_1.Store)
], Provider.prototype, "_store", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", core_1.Type),
    tslib_1.__metadata("design:paramtypes", [core_1.Type])
], Provider.prototype, "useClass", null);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [String])
], Provider.prototype, "scope", null);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], Provider.prototype, "configuration", null);
exports.Provider = Provider;
//# sourceMappingURL=Provider.js.map