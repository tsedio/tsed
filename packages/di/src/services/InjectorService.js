"use strict";
var InjectorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const util = require("util");
const Container_1 = require("../class/Container");
const LocalsContainer_1 = require("../class/LocalsContainer");
const Provider_1 = require("../class/Provider");
const configuration_1 = require("../decorators/configuration");
const injectable_1 = require("../decorators/injectable");
const InjectionError_1 = require("../errors/InjectionError");
const UndefinedTokenError_1 = require("../errors/UndefinedTokenError");
const interfaces_1 = require("../interfaces");
const GlobalProviders_1 = require("../registries/GlobalProviders");
const DIConfiguration_1 = require("./DIConfiguration");
/**
 * This service contain all services collected by `@Service` or services declared manually with `InjectorService.factory()` or `InjectorService.service()`.
 *
 * ### Example:
 *
 * ```typescript
 * import {InjectorService} from "@tsed/common";
 *
 * // Import the services (all services are decorated with @Service()";
 * import MyService1 from "./services/service1";
 * import MyService2 from "./services/service2";
 * import MyService3 from "./services/service3";
 *
 * // When all services is imported you can load InjectorService.
 * const injector = new InjectorService()
 *
 * await injector.load();
 *
 * const myService1 = injector.get<MyService1>(MyServcice1);
 * ```
 *
 * > Note: `ServerLoader` make this automatically when you use `ServerLoader.mount()` method (or settings attributes) and load services and controllers during the starting server.
 *
 */
let InjectorService = InjectorService_1 = class InjectorService extends Container_1.Container {
    constructor() {
        super();
        this.settings = new DIConfiguration_1.DIConfiguration();
        this.logger = console;
        this.resolvers = [];
        this.scopes = {};
        this.resolvedConfiguration = false;
        const provider = this.addProvider(InjectorService_1).getProvider(InjectorService_1);
        provider.instance = this;
    }
    /**
     * Retrieve default scope for a given provider.
     * @param provider
     */
    scopeOf(provider) {
        return provider.scope || this.scopes[provider.type] || interfaces_1.ProviderScope.SINGLETON;
    }
    /**
     * Clone a provider from GlobalProviders and the given token. forkProvider method build automatically the provider if the instance parameter ins't given.
     * @param token
     * @param instance
     */
    forkProvider(token, instance) {
        const provider = this.addProvider(token).getProvider(token);
        if (!instance) {
            instance = this.invoke(token);
        }
        provider.instance = instance;
        return provider;
    }
    /**
     * Return a list of instance build by the injector.
     */
    toArray() {
        return super.toArray().map(provider => provider.instance);
    }
    /**
     * Get a service or factory already constructed from his symbol or class.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     * import MyService from "./services";
     *
     * class OtherService {
     *      constructor(injectorService: InjectorService) {
     *          const myService = injectorService.get<MyService>(MyService);
     *      }
     * }
     * ```
     *
     * @param token The class or symbol registered in InjectorService.
     * @returns {boolean}
     */
    get(token) {
        return (super.has(token) && super.get(core_1.getClassOrSymbol(token)).instance) || undefined;
    }
    /**
     * The has() method returns a boolean indicating whether an element with the specified key exists or not.
     * @returns {boolean}
     * @param token
     */
    has(token) {
        return super.has(core_1.getClassOrSymbol(token)) && !!this.get(token);
    }
    /**
     * Invoke the class and inject all services that required by the class constructor.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     * import MyService from "./services";
     *
     * class OtherService {
     *     constructor(injectorService: InjectorService) {
     *          const myService = injectorService.invoke<MyService>(MyService);
     *      }
     *  }
     * ```
     *
     * @param token The injectable class to invoke. Class parameters are injected according constructor signature.
     * @param locals  Optional object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
     * @param options
     * @returns {T} The class constructed.
     */
    invoke(token, locals = new LocalsContainer_1.LocalsContainer(), options = {}) {
        const provider = this.getProvider(token);
        let instance;
        !locals.has(configuration_1.Configuration) && locals.set(configuration_1.Configuration, this.settings);
        if (locals.has(token)) {
            instance = locals.get(token);
        }
        else if (!provider || options.rebuild) {
            instance = this.resolve(token, locals, options);
            this.getProvider(token).instance = instance;
        }
        else {
            switch (this.scopeOf(provider)) {
                case interfaces_1.ProviderScope.SINGLETON:
                    if (!this.has(token)) {
                        provider.instance = this.resolve(token, locals, options);
                        if (provider.isAsync()) {
                            provider.instance.then((instance) => {
                                provider.instance = instance;
                            });
                        }
                    }
                    instance = this.get(token);
                    break;
                case interfaces_1.ProviderScope.REQUEST:
                    instance = this.resolve(token, locals, options);
                    locals.set(token, instance);
                    break;
                case interfaces_1.ProviderScope.INSTANCE:
                    instance = this.resolve(provider.provide, locals, options);
                    break;
            }
        }
        return instance;
    }
    /**
     * Build only providers which are asynchronous.
     */
    loadAsync(locals = new LocalsContainer_1.LocalsContainer()) {
        const _super = Object.create(null, {
            toArray: { get: () => super.toArray }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const providers = _super.toArray.call(this);
            for (const provider of providers) {
                if (!provider.root) {
                    if (!locals.has(provider.token)) {
                        if (provider.isAsync()) {
                            yield this.invoke(provider.token, locals);
                        }
                        if (provider.instance) {
                            locals.set(provider.token, provider.instance);
                        }
                    }
                }
            }
            return locals;
        });
    }
    loadSync(locals = new LocalsContainer_1.LocalsContainer()) {
        const providers = super.toArray();
        for (const provider of providers) {
            if (!provider.root) {
                if (!locals.has(provider.token) && this.scopeOf(provider) === interfaces_1.ProviderScope.SINGLETON) {
                    this.invoke(provider.token, locals);
                }
                if (provider.instance) {
                    locals.set(provider.token, provider.instance);
                }
            }
        }
        return locals;
    }
    /**
     * Build all providers from given container (or GlobalProviders) and emit `$onInit` event.
     *
     * @param container
     */
    load(container = GlobalProviders_1.GlobalProviders) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Clone all providers in the container
            this.addProviders(container);
            // Resolve configuration from providers
            this.resolveConfiguration();
            // build async and sync provider
            let locals = yield this.loadAsync();
            // load sync provider
            locals = this.loadSync(locals);
            yield locals.emit("$onInit");
            return locals;
        });
    }
    /**
     * Load all configurations registered on providers
     */
    resolveConfiguration() {
        if (this.resolvedConfiguration) {
            return;
        }
        super.forEach(provider => {
            if (provider.configuration) {
                Object.entries(provider.configuration).forEach(([key, value]) => {
                    this.settings.default.set(key, core_1.deepExtends(this.settings.default.get(key) || {}, value));
                });
            }
            if (provider.resolvers) {
                this.resolvers.push(...provider.resolvers);
            }
        });
        this.scopes = this.settings.scopes = Object.freeze(Object.assign({}, this.settings.default.get("scopes"), this.settings.scopes));
        this.settings.build();
        this.resolvedConfiguration = true;
    }
    /**
     *
     * @param instance
     * @param locals
     * @param options
     */
    bindInjectableProperties(instance, locals, options) {
        const store = core_1.Store.from(core_1.getClass(instance));
        if (store && store.has("injectableProperties")) {
            const properties = store.get("injectableProperties") || [];
            Object.keys(properties)
                .map(key => properties[key])
                .forEach(definition => {
                switch (definition.bindingType) {
                    case interfaces_1.InjectablePropertyType.METHOD:
                        this.bindMethod(instance, definition);
                        break;
                    case interfaces_1.InjectablePropertyType.PROPERTY:
                        this.bindProperty(instance, definition, locals, options);
                        break;
                    case interfaces_1.InjectablePropertyType.CONSTANT:
                        this.bindConstant(instance, definition);
                        break;
                    case interfaces_1.InjectablePropertyType.VALUE:
                        this.bindValue(instance, definition);
                        break;
                    case interfaces_1.InjectablePropertyType.INTERCEPTOR:
                        this.bindInterceptor(instance, definition);
                        break;
                }
            });
        }
    }
    /**
     *
     * @param instance
     * @param {string} propertyKey
     */
    bindMethod(instance, { propertyKey }) {
        const target = core_1.getClass(instance);
        const originalMethod = instance[propertyKey];
        const deps = core_1.Metadata.getParamTypes(core_1.prototypeOf(target), propertyKey);
        instance[propertyKey] = () => {
            const services = deps.map((dependency) => this.get(dependency));
            return originalMethod.call(instance, ...services);
        };
    }
    /**
     *
     * @param instance
     * @param {string} propertyKey
     * @param {any} useType
     * @param locals
     * @param options
     */
    bindProperty(instance, { propertyKey, useType }, locals, options) {
        Object.defineProperty(instance, propertyKey, {
            get: () => {
                return this.invoke(useType, locals, options);
            }
        });
    }
    /**
     *
     * @param instance
     * @param {string} propertyKey
     * @param {any} useType
     */
    bindValue(instance, { propertyKey, expression, defaultValue }) {
        const descriptor = {
            get: () => this.settings.get(expression) || defaultValue,
            set: (value) => this.settings.set(expression, value),
            enumerable: true,
            configurable: true
        };
        Object.defineProperty(instance, propertyKey, descriptor);
    }
    /**
     *
     * @param instance
     * @param {string} propertyKey
     * @param {any} useType
     */
    bindConstant(instance, { propertyKey, expression, defaultValue }) {
        const clone = (o) => {
            if (o) {
                return Object.freeze(core_1.deepClone(o));
            }
            return defaultValue;
        };
        const descriptor = {
            get: () => clone(this.settings.get(expression)),
            enumerable: true,
            configurable: true
        };
        Object.defineProperty(instance, propertyKey, descriptor);
        return descriptor;
    }
    /**
     *
     * @param instance
     * @param propertyKey
     * @param useType
     * @param options
     */
    bindInterceptor(instance, { propertyKey, useType, options }) {
        const target = core_1.getClass(instance);
        const originalMethod = instance[propertyKey];
        instance[propertyKey] = (...args) => {
            const next = (err) => {
                if (!err) {
                    return originalMethod.apply(instance, args);
                }
                throw err;
            };
            const context = {
                target,
                method: propertyKey,
                propertyKey,
                args,
                options,
                proceed: util.deprecate(next, "context.proceed() is deprecated. Use context.next() or next() parameters instead."),
                next
            };
            const interceptor = this.get(useType);
            if (interceptor.aroundInvoke) {
                interceptor.aroundInvoke = util.deprecate(interceptor.aroundInvoke.bind(interceptor), "interceptor.aroundInvoke is deprecated. Use interceptor.intercept instead.");
                return interceptor.aroundInvoke(context, options);
            }
            return interceptor.intercept(Object.assign(Object.assign({}, context), { options }), next);
        };
    }
    /**
     * Invoke a class method and inject service.
     *
     * #### IInjectableMethod options
     *
     * * **target**: Optional. The class instance.
     * * **methodName**: `string` Optional. The method name.
     * * **designParamTypes**: `any[]` Optional. List of injectable types.
     * * **locals**: `Map<Function, any>` Optional. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
     *
     * #### Example
     *
     * @param target
     * @param locals
     * @param options
     * @private
     */
    resolve(target, locals, options = {}) {
        const { token, deps, construct, isBindable, imports } = this.mapInvokeOptions(target, options);
        const provider = this.getProvider(target);
        if (provider) {
            if (!provider.injectable && options.parent) {
                throw new InjectionError_1.InjectionError(token, `${core_1.nameOf(token)} ${provider.type} is not injectable to another provider`);
            }
            const { onInvoke } = GlobalProviders_1.GlobalProviders.getRegistrySettings(target);
            if (onInvoke) {
                onInvoke(provider, locals, deps);
            }
        }
        let instance;
        let currentDependency = false;
        try {
            const invokeDependency = (parent) => (token, index) => {
                currentDependency = { token, index, deps };
                return core_1.isInheritedFrom(token, Provider_1.Provider, 1) ? provider : this.invoke(token, locals, { parent });
            };
            // Invoke manually imported providers
            imports.forEach(invokeDependency());
            // Inject dependencies
            const services = deps.map(invokeDependency(token));
            currentDependency = false;
            instance = construct(services);
        }
        catch (error) {
            InjectionError_1.InjectionError.throwInjectorError(token, currentDependency, error);
        }
        if (instance === undefined) {
            throw new InjectionError_1.InjectionError(token, `Unable to create new instance from undefined value. Check your provider declaration for ${core_1.nameOf(token)}`);
        }
        if (instance && isBindable) {
            this.bindInjectableProperties(instance, locals, options);
        }
        return instance;
    }
    /**
     * Create options to invoke a provider or class.
     * @param token
     * @param options
     */
    mapInvokeOptions(token, options) {
        let imports = options.imports;
        let deps = options.deps;
        let scope = options.scope;
        let construct;
        let isBindable = false;
        if (!token) {
            throw new UndefinedTokenError_1.UndefinedTokenError();
        }
        if (!this.hasProvider(token)) {
            // findById
            const resolver = this.resolvers.find(resolver => {
                return resolver.get(token);
            });
            const provider = new Provider_1.Provider(token);
            if (resolver) {
                provider.useFactory = () => resolver.get(token);
            }
            this.setProvider(token, provider);
        }
        const provider = this.getProvider(token);
        scope = scope || this.scopeOf(provider);
        deps = deps || provider.deps;
        imports = imports || provider.imports;
        if (provider.useValue) {
            construct = () => (core_1.isFunction(provider.useValue) ? provider.useValue() : provider.useValue);
        }
        else if (provider.useFactory) {
            construct = (deps) => provider.useFactory(...deps);
        }
        else if (provider.useAsyncFactory) {
            construct = (deps) => provider.useAsyncFactory(...deps);
        }
        else {
            // useClass
            isBindable = true;
            deps = deps || core_1.Metadata.getParamTypes(provider.useClass);
            construct = (deps) => new provider.useClass(...deps);
        }
        return {
            token,
            scope: scope || core_1.Store.from(token).get("scope") || interfaces_1.ProviderScope.SINGLETON,
            deps: deps || [],
            imports: imports || [],
            isBindable,
            construct
        };
    }
};
InjectorService = InjectorService_1 = tslib_1.__decorate([
    injectable_1.Injectable({
        scope: interfaces_1.ProviderScope.SINGLETON,
        global: true
    }),
    tslib_1.__metadata("design:paramtypes", [])
], InjectorService);
exports.InjectorService = InjectorService;
//# sourceMappingURL=InjectorService.js.map