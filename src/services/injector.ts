
import Metadata from "./metadata";
import {UNKNOW_SERVICE} from "../constants/errors-msgs";
import {IProvider, IInjectableMethod} from "../interfaces";
import {getClassName, getClassOrSymbol} from "../utils";

/**
 * InjectorService manage all service collected by `@Service()` decorator.
 */
export default class InjectorService {

    private static providers: Map<Function, any> = new Map<Function, any>();

    /**
     * Invoke the target class or function.
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
    public invokeMethod(handler: any, options: IInjectableMethod<any> | any[]): any {
        return InjectorService.invokeMethod(handler, options);
    }

    /**
     * Return the instance service/factory.
     * @param target
     * @returns {boolean}
     */
    public get<T>(target: any): T {
        return InjectorService.get<T>(target);
    }

    /**
     * Return true if the target provider exists and has an instance.
     * @param target
     * @returns {boolean}
     */
    public has(target): boolean {
        return InjectorService.has(target);
    }

    /**
     * Invoke the target class or function.
     * @param target
     * @param locals
     * @param designParamTypes
     */
    static invoke<T>(target: any, locals: Map<string|Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {

        if (!designParamTypes) {
            designParamTypes = Metadata.getParamTypes(target);
        }

        const services = designParamTypes
            .map((serviceType: any) => {

                const serviceName = typeof serviceType === "function" ? getClassName(serviceType) : serviceType;

                /* istanbul ignore next */
                if (locals.has(serviceName)) {
                    return locals.get(serviceName);
                }

                if (locals.has(serviceType)) {
                    return locals.get(serviceType);
                }

                /* istanbul ignore next */
                if (!this.has(serviceType)) {
                    console.log(serviceType, target, serviceName);
                    throw Error(UNKNOW_SERVICE(getClassName(target) + " > " + serviceName.toString()));
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
    static invokeMethod(handler: any, options: IInjectableMethod<any> | any[]) {

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

                const serviceName = typeof serviceType === "function" ? getClassName(serviceType) : serviceType;

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
    static construct(target): InjectorService {

        const provider: IProvider<any> = this.providers.get(getClassOrSymbol(target));

        /* istanbul ignore else */
        if (provider.instance === undefined || provider.type === "service") {

            provider.instance = this.invoke<any>(provider.useClass);

            // $log.debug("[TSED]", getClassName(target), "instantiated");
        }


        return this;
    }

    /**
     * Set a new provider from providerSetting.
     * @param provider class token.
     * @param instance Instance
     */
    static set(provider: IProvider<any> | any, instance?: any): InjectorService {

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

        provider = Object.assign(
            InjectorService.providers.get(getClassOrSymbol(target)) || {},
            provider
        );

        InjectorService.providers.set(getClassOrSymbol(target), provider);

        return InjectorService;
    }

    /**
     * Return the instance service/factory.
     * @param target
     * @returns {boolean}
     */
    static get = <T>(target: any): T =>
        InjectorService.providers.get(getClassOrSymbol(target)).instance;

    /**
     * Return true if the target provider exists and has an instance.
     * @param target
     * @returns {boolean}
     */
    static has = (target: any): boolean =>
        InjectorService.providers.has(getClassOrSymbol(target)) && !!InjectorService.get(target);

    /**
     * Initialize injectorService and load all services/factories.
     */
    static load() {

        this.providers
            .forEach((provider: IProvider<any>) => {
                InjectorService.construct(provider.provide);
            });


        this.providers.forEach((provider: IProvider<any>) => {

            const service = InjectorService.get<{$afterServicesInit: Function}>(provider.provide);

            if (service.$afterServicesInit) {
                service.$afterServicesInit();
            }

        });
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