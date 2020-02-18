"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const di_1 = require("@tsed/di");
const ControllerProvider_1 = require("../models/ControllerProvider");
const ControllerRegistry_1 = require("../registries/ControllerRegistry");
const RouteService_1 = require("./RouteService");
/**
 * @private
 * @deprecated
 */
let ControllerService = class ControllerService extends core_1.ProxyMap {
    constructor(injectorService, settings, routeService) {
        super(injectorService, { filter: { type: di_1.ProviderType.CONTROLLER } });
        this.injectorService = injectorService;
        this.settings = settings;
        this.routeService = routeService;
    }
    /**
     * @deprecated
     */
    /* istanbul ignore next */
    get routes() {
        return this.routeService.routes || [];
    }
    /**
     *
     * @param target
     * @returns {ControllerProvider}
     * @deprecated
     */
    static get(target) {
        return ControllerRegistry_1.ControllerRegistry.get(target);
    }
    /**
     *
     * @param target
     * @deprecated
     */
    static has(target) {
        return ControllerRegistry_1.ControllerRegistry.has(target);
    }
    /**
     *
     * @param target
     * @param provider
     * @deprecated
     */
    static set(target, provider) {
        ControllerRegistry_1.ControllerRegistry.set(target, provider);
        return this;
    }
    /**
     * Invoke a controller from his Class.
     * @param target
     * @param locals
     * @param designParamTypes
     * @returns {T}
     * @deprecated
     */
    invoke(target, locals = new Map(), designParamTypes) {
        return this.injectorService.invoke(target.provide || target, locals);
    }
};
tslib_1.__decorate([
    core_1.Deprecated("ControllerService.invoke(). Removed feature. Use injectorService.invoke instead of."),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Map, Array]),
    tslib_1.__metadata("design:returntype", typeof (_a = typeof T !== "undefined" && T) === "function" ? _a : Object)
], ControllerService.prototype, "invoke", null);
tslib_1.__decorate([
    core_1.Deprecated("static ControllerService.get(). Removed feature."),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.Type]),
    tslib_1.__metadata("design:returntype", Object)
], ControllerService, "get", null);
tslib_1.__decorate([
    core_1.Deprecated("static ControllerService.has(). Removed feature."),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.Type]),
    tslib_1.__metadata("design:returntype", void 0)
], ControllerService, "has", null);
tslib_1.__decorate([
    core_1.Deprecated("static ControllerService.set(). Removed feature."),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.Type, ControllerProvider_1.ControllerProvider]),
    tslib_1.__metadata("design:returntype", void 0)
], ControllerService, "set", null);
ControllerService = tslib_1.__decorate([
    di_1.Injectable({
        scope: di_1.ProviderScope.SINGLETON,
        global: true
    }),
    tslib_1.__param(1, di_1.Configuration()),
    tslib_1.__metadata("design:paramtypes", [di_1.InjectorService, Object, RouteService_1.RouteService])
], ControllerService);
exports.ControllerService = ControllerService;
//# sourceMappingURL=ControllerService.js.map