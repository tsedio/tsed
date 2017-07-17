import {ProxyRegistry} from "../../core/class/ProxyRegistry";
import {Registry} from "../../core/class/Registry";
/**
 * @module common/mvc
 */
/** */
import {MiddlewareProvider} from "../class/MiddlewareProvider";
import {IMiddlewareOptions} from "../interfaces/IMiddlewareOptions";

export const MiddlewareRegistry = new Registry<MiddlewareProvider, IMiddlewareOptions>(MiddlewareProvider);

export abstract class ProxyMiddlewareRegistry extends ProxyRegistry<MiddlewareProvider, IMiddlewareOptions> {
    constructor() {
        super(MiddlewareRegistry);
    }
}