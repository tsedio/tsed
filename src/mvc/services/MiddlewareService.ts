/**
 * @module common/mvc
 */
/** */

import {$log} from "ts-log-debug";

import {Type} from "../../core";
import {ProxyRegistry} from "../../core/class/ProxyRegistry";
import {Service} from "../../di/decorators/service";
import {InjectorService} from "../../di/services/InjectorService";
import {MiddlewareProvider} from "../class/MiddlewareProvider";
import {UnknowMiddlewareError} from "../errors/UnknowMiddlewareError";
import {IMiddleware, IMiddlewareOptions} from "../interfaces";

import {MiddlewareRegistry} from "../registries/MiddlewareRegistry";


/**
 *
 */
@Service()
export class MiddlewareService extends ProxyRegistry<MiddlewareProvider, IMiddlewareOptions> {
    constructor(private injectorService: InjectorService) {
        super(MiddlewareRegistry);
    }

    /**
     *
     */
    $onInit() {

        /* istanbul ignore next */
        $log.debug("Build middlewares");

        InjectorService.buildRegistry(MiddlewareRegistry);

        $log.debug("Middlewares registry built");
    }

    /**
     *
     * @param target
     * @returns {ControllerProvider}
     */
    static get = (target: Type<any>): MiddlewareProvider | undefined =>
        MiddlewareRegistry.get(target);

    /**
     *
     * @param target
     * @param provider
     */
    static set(target: Type<any>, provider: MiddlewareProvider) {
        MiddlewareRegistry.set(target, provider);
        return this;
    }

    /**
     *
     * @param target
     */
    static has = (target: Type<any>): boolean =>
        MiddlewareRegistry.has(target);

    /**
     *
     * @param target
     * @param locals
     * @param designParamTypes
     * @returns {T}
     */
    // static invoke<T extends IMiddleware>(target: Type<T>, locals: Map<Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {
    //    const provider = MiddlewareRegistry.get(target);
    //    return InjectorService.invoke<T>(provider.useClass);
    // }

    /**
     *
     * @param target
     * @param locals
     * @param designParamTypes
     * @returns {T}
     */
    invoke<T extends IMiddleware>(target: Type<T>, locals: Map<Function, any> = new Map<Function, any>(), designParamTypes?: any[]): T {
        return this.injectorService.invoke<T>(target, locals, designParamTypes);
    }

    /**
     *
     * @param target
     * @param args
     * @returns {any}
     */
    invokeMethod<T extends IMiddleware>(target: Type<T>, ...args: any[]) {

        const provider = this.get(target);

        if (!provider) {
            throw new UnknowMiddlewareError(target);
        }

        const instance = provider.instance || this.invoke(provider.useClass);

        return instance.use(...args);
    }
}