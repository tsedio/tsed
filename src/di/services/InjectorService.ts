/**
 * @module di
 */
/** */
import {$log} from "ts-log-debug";
import {nameOf} from "../../core";
import {Metadata} from "../../core/class/Metadata";
import {Registry} from "../../core/class/Registry";
import {Type} from "../../core/interfaces/Type";
import {Provider} from "../class/Provider";
import {InjectionError} from "../errors/InjectionError";
import {IInjectableMethod} from "../interfaces/InjectableMethod";
import {IProvider} from "../interfaces/Provider";
import {ProviderRegistry, ProxyProviderRegistry} from "../registries/ProviderRegistry";

/**
 * InjectorService manage all service collected by `@Service()` decorators.
 */
export class InjectorService extends ProxyProviderRegistry {

    /**
     * Invoke the target provide or function.
     * @param target
     * @param locals
     * @param designParamTypes
     */
    public invoke<T>(target: any, locals: Map<Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {
        return InjectorService.invoke<T>(target, locals, designParamTypes);
    }

    /**
     * Invoke a method and try to inject services.
     * @returns {any}
     * @param handler
     * @param options
     */
    public invokeMethod(handler: any, options: IInjectableMethod<any> | any[]): any {
        return InjectorService.invokeMethod(handler, options);
    }

    /**
     * Return the instance service/factory.
     * @param target
     * @returns {boolean}
     */
    public get<T>(target: Type<T> | symbol): T {
        return super.get(target).instance;
    }

    public emit(eventName, ...args) {
        return InjectorService.emit(eventName, ...args);
    }

    public load(): InjectorService {
        InjectorService.load();
        return this;
    }

    /**
     * Invoke the target provide or function.
     * @param target
     * @param locals
     * @param designParamTypes
     */
    static invoke<T>(target: any, locals: Map<string | Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {

        if (!designParamTypes) {
            designParamTypes = Metadata.getParamTypes(target);
        }

        const services = designParamTypes
            .map((serviceType: any) => {

                const serviceName = typeof serviceType === "function" ? nameOf(serviceType) : serviceType;

                /* istanbul ignore next */
                if (locals.has(serviceName)) {
                    return locals.get(serviceName);
                }

                if (locals.has(serviceType)) {
                    return locals.get(serviceType);
                }

                /* istanbul ignore next */
                if (!this.has(serviceType)) {
                    throw new InjectionError(target, serviceName.toString());
                }

                return this.get(serviceType);
            });

        return new target(...services);
    }

    /**
     * Invoke a method and try inject to inject service.
     * @returns {any}
     * @param handler
     * @param options
     */
    static invokeMethod(handler: any, options: IInjectableMethod<any> | any[]) {

        let designParamTypes, target, methodName, locals;

        if (options instanceof Array) {
            designParamTypes = options as Array<any>;
        } else {
            designParamTypes = options.designParamTypes;
            target = options.target;
            methodName = options.methodName;
            locals = options.locals;
        }

        if (locals instanceof Map === false) {
            locals = new Map();
        }

        if (handler.$injected) {
            return handler.call(target, locals);
        }

        if (!designParamTypes) {
            designParamTypes = Metadata.getParamTypes(target, methodName);
        }

        const services = designParamTypes
            .map((serviceType: any) => {

                const serviceName = typeof serviceType === "function" ? nameOf(serviceType) : serviceType;

                /* istanbul ignore next */
                if (locals.has(serviceName)) {
                    return locals.get(serviceName);
                }

                if (locals.has(serviceType)) {
                    return locals.get(serviceType);
                }

                /* istanbul ignore next */
                if (!this.has(serviceType)) {
                    return undefined;
                }

                return this.get(serviceType);

            });

        return handler(...services);
    }

    /**
     * Construct the service with his dependencies.
     * @param target The service to be built.
     */
    static construct<T>(target: Type<any> | symbol): T {

        const provider: Provider<any> = ProviderRegistry.get(target);

        /* istanbul ignore else */
        return this.invoke<any>(provider.useClass);
    }

    /**
     *
     * @param registry
     * @param callback
     */
    static buildRegistry(registry: Registry<Provider<any>, any>, callback: (provider: Provider<any>) => boolean = () => true): Registry<Provider<any>, any> {
        registry.forEach(provider => {
            if (typeof callback && callback(provider)) {
                provider.instance = InjectorService.invoke(provider.useClass);
            }

            const token = nameOf(provider.provide);
            const useClass = nameOf(provider.useClass);

            $log.debug(nameOf(provider.provide), "built", token === useClass ? "" : `from class ${useClass}`);

        });

        return registry;
    }

    /**
     * Set a new provider from providerSetting.
     * @param provider provide token.
     * @param instance Instance
     */
    static set(provider: IProvider<any> | any, instance?: any) {
        let target;

        if (provider["provide"] === undefined) {

            target = provider;

            provider = <IProvider<any>>{
                provide: target,
                useClass: target,
                instance: instance || target,
                type: "factory"
            };

        } else {
            target = provider.provide;
        }

        ProviderRegistry.merge(provider.provide, provider);

        return InjectorService;
    }

    /**
     * Return the instance service/factory.
     * @param target
     * @returns {boolean}
     */
    static get = <T>(target: any): T =>
        ProviderRegistry.get(target).instance;

    /**
     * Return true if the target provider exists and has an instance.
     * @param target
     * @returns {boolean}
     */
    static has = (target: any): boolean =>
        ProviderRegistry.has(target);

    /**
     * Initialize injectorService and load all services/factories.
     */
    static async load() {

        this.buildRegistry(
            ProviderRegistry,
            (provider) => provider.instance === undefined || provider.type === "service"
        );

        return this.emit("$onInjectorReady");
    }

    /**
     *
     * @param eventName
     * @param args
     */
    static async emit(eventName: string, ...args): Promise<any[]> {
        const promises = [];

        ProviderRegistry.forEach((provider: IProvider<any>) => {

            const service = InjectorService.get<any>(provider.provide);

            if (eventName in service) {
                promises.push(service[eventName](...args));
            }
        });

        return Promise.all(promises);
    }

    /**
     * Add a new service that will built when InjectorService will be loaded.
     */
    static service = (target: any) =>
        InjectorService.set({provide: target, useClass: target, type: "service"});

    /**
     * Add a new factory.
     */
    static factory = (target: any, instance: any) =>
        InjectorService.set({provide: target, useClass: target, instance: instance, type: "factory"});

}

/**
 * Create the first service InjectorService
 */
InjectorService.factory(InjectorService, new InjectorService());