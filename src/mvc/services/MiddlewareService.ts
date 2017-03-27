/**
 * @module mvc
 */ /** */

import {$log} from "ts-log-debug";

import {Type} from "../../core";

import {ServerSettingsService} from "../../server/services/ServerSettings";
import {Service} from "../../di/decorators/service";
import {IMiddleware} from "../interfaces";

import {MiddlewareRegistry, ProxyMiddlewareRegistry} from "../registries/MiddlewareRegistry";
import {MiddlewareProvider} from "../class/MiddlewareProvider";
import {InjectorService} from "../../di/services/InjectorService";
import {UnknowMiddlewareError} from "../errors/UnknowMiddlewareError";


/**
 *
 */
@Service()
export class MiddlewareService extends ProxyMiddlewareRegistry {

    constructor(private injectorService: InjectorService, private serverSettings: ServerSettingsService) {
        super();
    }

    /**
     *
     */
    $onInjectorReady() {

        /* istanbul ignore next */
        $log.debug("Build middlewares");

        InjectorService.buildRegistry(MiddlewareRegistry);
    }

    /**
     *
     * @param target
     * @returns {ControllerProvider}
     */
    static get = (target: Type<any>): MiddlewareProvider =>
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

        if (!this.has(target)) {
            throw new UnknowMiddlewareError(target);
        }

        const provider = this.get(target);
        const instance = provider.instance || this.invoke(provider.useClass);

        return instance.use(...args);
    }
}