import {Deprecated, ProxyRegistry, Type} from "@tsed/core";
import {Provider} from "../../di/class/Provider";
import {Service} from "../../di/decorators/service";
import {IProvider} from "../../di/interfaces/IProvider";
import {ProviderRegistry} from "../../di/registries/ProviderRegistry";
import {InjectorService} from "../../di/services/InjectorService";
import {UnknowMiddlewareError} from "../errors/UnknowMiddlewareError";
import {IMiddleware} from "../interfaces";

/**
 * @deprecated This service will be removed in a future release. Use ProviderRegistry directly.
 */
@Service()
export class MiddlewareService extends ProxyRegistry<Provider<any>, IProvider<any>> {
    constructor(private injectorService: InjectorService) {
        super(ProviderRegistry);
    }

    /**
     *
     * @param target
     * @returns {Provider}
     * @deprecated
     */
    @Deprecated("removed feature")
    /* istanbul ignore next */
    static get(target: Type<any>): Provider<any> | undefined {
        return ProviderRegistry.get(target);
    }

    /**
     *
     * @param target
     * @param provider
     */
    @Deprecated("removed feature")
    /* istanbul ignore next */
    static set(target: Type<any>, provider: Provider<any>) {
        ProviderRegistry.set(target, provider);

        return this;
    }

    /**
     *
     * @param target
     * @deprecated
     */
    @Deprecated("removed feature")
    /* istanbul ignore next */
    static has(target: Type<any>): boolean {
        return ProviderRegistry.has(target);
    }

    /**
     *
     * @param target
     * @param locals
     * @param designParamTypes
     * @returns {T}
     */
    @Deprecated("removed feature")
    /* istanbul ignore next */
    invoke<T extends IMiddleware>(target: Type<T>, locals: Map<Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {
        return this.injectorService.invoke<T>(target, locals, designParamTypes);
    }

    /**
     *
     * @param target
     * @param args
     * @returns {any}
     */
    @Deprecated("removed feature")
    /* istanbul ignore next */
    invokeMethod<T extends IMiddleware>(target: Type<T>, ...args: any[]) {

        const instance = this.injectorService.get<T>(target);

        if (!instance || !instance.use) {
            throw new UnknowMiddlewareError(target);
        }

        return instance.use(...args);
    }
}