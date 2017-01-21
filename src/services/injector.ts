
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
     * Invoke
     * @param target
     * @param locals
     */
    static invoke<T>(target, locals: WeakMap<string|Function, any> = new WeakMap<string|Function, any>()): T {

        const services = (Metadata.get(DESIGN_PARAM_TYPES, target) || [])
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

                const provider = this.providers.get(serviceType);

                if (provider.type === 'constant') {
                    return JSON.parse(JSON.stringify(provider.instance));
                }

                return provider.instance;
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

            provider.instance = this.invoke<any>(target);

            $log.debug("[TSED]", getClassName(target), "instantiated");
        }

        // TODO ... not necessary ?
        /*Metadata
         .get(DESIGN_PARAM_TYPES, target)
         .forEach((type: any) => {


         if (!this.has(type)) {
         this.construct(type);
         }

         });*/







        return this;
    }

    /**
     *
     * @param providerSetting
     */
    static set(providerSetting: IProvider): InjectorService {

        const target = providerSetting.provide;

        providerSetting = this.has(target) ? InjectorService.providers.get(getClass(target)) : providerSetting;

        InjectorService.providers.set(getClass(target), providerSetting);

        return this;
    }

    /**
     *
     * @param target
     * @returns {boolean}
     */
    static get = (target) => InjectorService.providers.get(getClass(target)).instance;

    /**
     *
     * @param target
     * @returns {boolean}
     */
    static has = (target) => InjectorService.providers.has(getClass(target)) && InjectorService.get(target);

    /**
     *
     */
    static load() {

        this.providers
            .forEach((providerSettings: IProvider) => {
                InjectorService.construct(providerSettings.provide);
            });

    }

    /**
     *
     */
    static service = (target: any) => InjectorService.set({provide: target, useClass: target, type: 'service'});

    /**
     *
     */
    static factory = (target: any) => InjectorService.set({provide: target, useClass: target, instance: target, type: 'factory'});

    /**
     *
     */
    static value = (target: any) => InjectorService.set({provide: target, useClass: target, instance: target, type: 'value'});

    /**
     *
     */
    static constant = (target: any) => InjectorService.set({provide: target, useClass: target, instance: target, type: 'constant'});

}