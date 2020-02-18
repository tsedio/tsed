"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const constants_1 = require("../constants");
const ParamRegistry_1 = require("../registries/ParamRegistry");
/**
 * EndpointMetadata contains metadata about a controller and his method.
 * Each annotation (@Get, @Body...) attached to a method are stored in a endpoint.
 * EndpointMetadata convert this metadata to an array which contain arguments to call an Express method.
 *
 * Example :
 *
 *    @Controller("/my-path")
 *    provide MyClass {
 *
 *        @Get("/")
 *        @Authenticated()
 *        public myMethod(){}
 *    }
 *
 */
class EndpointMetadata extends core_1.Storable {
    constructor(options) {
        super(options.target, options.propertyKey, Object.getOwnPropertyDescriptor(options.target, options.propertyKey));
        // LIFECYCLE
        this.beforeMiddlewares = [];
        this.middlewares = [];
        this.afterMiddlewares = [];
        /**
         * Route strategy.
         */
        this.pathsMethods = [];
        this.responses = new Map();
        this.statusCode = 200;
        const { target, parent, statusCode, responses, propertyKey, beforeMiddlewares = [], middlewares = [], afterMiddlewares = [], pathsMethods = [], type } = options;
        this._type = core_1.Metadata.getReturnType(target, propertyKey);
        this.beforeMiddlewares = beforeMiddlewares;
        this.middlewares = middlewares;
        this.afterMiddlewares = afterMiddlewares;
        this.pathsMethods = pathsMethods;
        this.type = type;
        this.parent = parent;
        statusCode && (this.statusCode = statusCode);
        if (responses) {
            this.responses = responses;
        }
        else {
            this.responses.set(this.statusCode, {
                code: this.statusCode
            });
        }
    }
    get type() {
        return core_1.isPromise(this._type) || core_1.isArrayOrArrayClass(this._type) || this._type === Object ? undefined : this._type;
    }
    set type(type) {
        this._type = type;
    }
    /**
     * @deprecated
     */
    get methodClassName() {
        return String(this.propertyKey);
    }
    /**
     *
     * @returns {Store}
     */
    get store() {
        return this.parent ? this.parent.store : this._store;
    }
    get params() {
        return ParamRegistry_1.ParamRegistry.getParams(this.target, this.propertyKey);
    }
    get response() {
        return this.responses.get(this.statusCode);
    }
    /**
     * Find the a value at the controller level. Let this value be extended or overridden by the endpoint itself.
     *
     * @param key
     * @returns {any}
     */
    get(key) {
        const ctrlValue = core_1.Store.from(this.target).get(key);
        let meta = core_1.deepExtends(undefined, ctrlValue);
        const endpointValue = this.store.get(key);
        if (endpointValue !== undefined) {
            meta = core_1.deepExtends(meta, endpointValue);
        }
        return meta;
    }
    /**
     * Change the type and the collection type from the status code.
     * @param {string | number} code
     * @deprecated Use endpoint.responses.get(code)
     */
    statusResponse(code) {
        if (code && this.responses.has(+code)) {
            const { type, collectionType } = this.responses.get(+code);
            this.type = type;
            this.collectionType = collectionType;
        }
        else {
            const { type, collectionType } = this.responses.get(this.statusCode) || {};
            this.type = type;
            this.collectionType = collectionType;
        }
        return this.responses.get(+code) || {};
    }
    /**
     *
     * @param args
     * @returns {EndpointMetadata}
     */
    before(args) {
        this.beforeMiddlewares = this.beforeMiddlewares.concat(args);
        return this;
    }
    /**
     *
     * @param args
     * @returns {EndpointMetadata}
     */
    after(args) {
        this.afterMiddlewares = this.afterMiddlewares.concat(args);
        return this;
    }
    /**
     * Store all arguments collected via Annotation.
     * @param args
     */
    merge(args) {
        const expressMethods = {};
        const filteredArg = args.filter((arg) => {
            if (typeof arg === "string" && constants_1.EXPRESS_METHODS.indexOf(arg) > -1) {
                expressMethods.method = arg;
                return false;
            }
            if (typeof arg === "string" || arg instanceof RegExp) {
                expressMethods.path = arg;
                return false;
            }
            return !!arg;
        });
        if (expressMethods.method || expressMethods.path) {
            this.pathsMethods.push(expressMethods);
        }
        this.middlewares = this.middlewares.concat(filteredArg);
        return this;
    }
}
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Array)
], EndpointMetadata.prototype, "beforeMiddlewares", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Array)
], EndpointMetadata.prototype, "middlewares", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Array)
], EndpointMetadata.prototype, "afterMiddlewares", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Array)
], EndpointMetadata.prototype, "pathsMethods", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Map)
], EndpointMetadata.prototype, "responses", void 0);
tslib_1.__decorate([
    core_1.Enumerable(),
    tslib_1.__metadata("design:type", Number)
], EndpointMetadata.prototype, "statusCode", void 0);
tslib_1.__decorate([
    core_1.NotEnumerable(),
    tslib_1.__metadata("design:type", Object)
], EndpointMetadata.prototype, "parent", void 0);
exports.EndpointMetadata = EndpointMetadata;
//# sourceMappingURL=EndpointMetadata.js.map