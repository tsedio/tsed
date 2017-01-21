
import Metadata from "../metadata/metadata";
import {DESIGN_PARAM_TYPES} from "../constants/metadata-keys";
import {getClassName} from "../utils/class";
import {UNKNOW_SERVICE} from "../constants/errors-msgs";
import {$log} from "ts-log-debug";
import {IProvider} from '../interfaces/Provider';
import {getClass} from '../utils/utils';

/**
 * InjectorService manage all service collected by `@Service()` decorator.
 */
export default class InjectorService {

    private static providers: Map<string|Function, any> = new Map<string|Function, any>();

    /**
     *
     * @param target
     * @param locals
     * @returns {T}
     */
    public invoke<T>(target: any, locals: WeakMap<string|Function, any> = new WeakMap<string|Function, any>()): T {
        return InjectorService.invoke<T>(target, locals);
    }

    /**
     * Return the instance service/factory.
     * @param target
     * @returns {boolean}
     */
    public get(target) {
        return InjectorService.get(target);
    }

    /**
     * Return true if the target provider exists and has an instance.
     * @param target
     * @returns {boolean}
     */
    public has(target) {
        return InjectorService.has(target);
    }

    /**
     * Invoke the target class or function.
     * @param target
     * @param locals
     * @param designParamTypes
     */
    static invoke<T>(target: any, locals: WeakMap<string|Function, any> = new WeakMap<string|Function, any>(), designParamTypes?: any[]): T {

        if (!designParamTypes) {
            designParamTypes = Metadata.get(DESIGN_PARAM_TYPES, target) || [];
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
                    throw Error(UNKNOW_SERVICE(serviceName));
                }

                return this.get(serviceType);
            });

        return new target(...services);
    }

    /**
     * Construct the service with his dependencies.
     * @param target The service to be built.
     */
    static construct(target) {

        const provider: IProvider = this.providers.get(getClass(target));

        /* istanbul ignore else */
        if (provider.instance === undefined) {

            provider.instance = this.invoke<any>(provider.useClass);

            $log.debug("[TSED]", getClassName(target), "instantiated");
        }


        return this;
    }

    /**
     * Set a new provider from providerSetting.
     * @param provider
     */
    static set(provider: IProvider): InjectorService {

        const target = provider.provide;

        provider = this.has(target) ? InjectorService.providers.get(getClass(target)) : provider;

        InjectorService.providers.set(getClass(target), provider);

        return InjectorService;
    }

    /**
     * Return the instance service/factory.
     * @param target
     * @returns {boolean}
     */
    static get = (target) => InjectorService.providers.get(getClass(target)).instance;

    /**
     * Return true if the target provider exists and has an instance.
     * @param target
     * @returns {boolean}
     */
    static has = (target) => InjectorService.providers.has(getClass(target)) && InjectorService.get(target);

    /**
     * Initialize injectorService and load all services/factories.
     */
    static load() {

        this.factory(InjectorService, new InjectorService());

        this.providers
            .forEach((provider: IProvider) => {
                InjectorService.construct(provider.provide);
            });

    }

    /**
     * Add a new service that will built when InjectorService will be loaded.
     */
    static service = (target: any) => InjectorService.set({provide: target, useClass: target, type: 'service'});

    /**
     * Add a new factory.
     */
    static factory = (target: any, instance: any) => InjectorService.set({provide: target, useClass: target, instance: instance, type: 'factory'});

}