/**
 * @module common/filters
 */
/** */
import {$log} from "ts-log-debug";
import {Type} from "../../core/interfaces/Type";
import {Service} from "../../di/decorators/service";
import {InjectorService} from "../../di/services/InjectorService";
import {ServerSettingsService} from "../../server/services/ServerSettingsService";
import {FilterProvider} from "../class/FilterProvider";
import {UnknowFilterError} from "../errors/UnknowFilterError";
import {IFilter} from "../interfaces";
import {FilterRegistry, ProxyFilterRegistry} from "../registries/FilterRegistry";
/**
 *
 */
@Service()
export class FilterService extends ProxyFilterRegistry {

    constructor(private injectorService: InjectorService, private serverSettings: ServerSettingsService) {
        super();
    }

    /**
     *
     */
    $onInjectorReady() {

        /* istanbul ignore next */
        $log.debug("Build filters");

        InjectorService.buildRegistry(FilterRegistry);
    }

    /**
     *
     * @param target
     * @returns {ControllerProvider}
     */
    static get = (target: Type<any>): FilterProvider =>
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
    invokeMethod<T extends IFilter>(target: Type<T>, ...args: any[]) {

        if (!this.has(target)) {
            throw new UnknowFilterError(target);
        }

        const provider = this.get(target);
        const instance = provider.instance || this.invoke(provider.useClass);

        return instance.transform(...args);
    }

}