import {$log} from "ts-log-debug";
import {ProxyRegistry} from "../../core/class/ProxyRegistry";
import {Type} from "../../core/interfaces/Type";
import {Service} from "../../di/decorators/service";
import {IProviderOptions} from "../../di/interfaces";
import {InjectorService} from "../../di/services/InjectorService";
import {FilterProvider} from "../class/FilterProvider";
import {UnknowFilterError} from "../errors/UnknowFilterError";
import {IFilter} from "../interfaces";
import {FilterRegistry} from "../registries/FilterRegistry";

@Service()
export class FilterService extends ProxyRegistry<FilterProvider, IProviderOptions<any>> {
    constructor(private injectorService: InjectorService) {
        super(FilterRegistry);
    }

    /**
     *
     */
    $onInit() {

        /* istanbul ignore next */
        $log.debug("Build filters");

        InjectorService.buildRegistry(FilterRegistry);

        $log.debug("Filters registry built");
    }

    /**
     *
     * @param target
     * @returns {ControllerProvider}
     */
    static get = (target: Type<any>): FilterProvider | undefined =>
        FilterRegistry.get(target);

    /**
     *
     * @param target
     * @param provider
     */
    static set(target: Type<any>, provider: FilterProvider) {
        FilterRegistry.set(target, provider);
        return this;
    }

    /**
     *
     * @param target
     */
    static has = (target: Type<any>): boolean =>
        FilterRegistry.has(target);

    /**
     *
     * @param target
     * @param locals
     * @param designParamTypes
     * @returns {T}
     */
    invoke<T extends IFilter>(target: Type<T>, locals: Map<Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {
        return this.injectorService.invoke<T>(target, locals, designParamTypes);
    }

    /**
     *
     * @param target
     * @param args
     * @returns {any}
     */
    invokeMethod<T extends IFilter>(target: Type<T>, ...args: any[]): any {

        if (!this.has(target)) {
            throw new UnknowFilterError(target);
        }

        const provider = this.get(target);

        /* istanbul ignore next */
        if (!provider) {
            throw new Error("Target component not found in the registry");
        }

        const instance = provider.instance || this.invoke(provider.useClass);

        return instance.transform(...args);
    }

}