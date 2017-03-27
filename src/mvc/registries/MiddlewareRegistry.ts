/**
 * @module mvc
 */
/** */
import {MiddlewareProvider} from "../class/MiddlewareProvider";
import {IMiddlewareOptions} from "../interfaces/MiddlewareOptions";
import {Registry} from "../../core/class/Registry";
import {ProxyRegistry} from "../../core/class/ProxyRegistry";

export const MiddlewareRegistry = new Registry<MiddlewareProvider, IMiddlewareOptions>(MiddlewareProvider);

export abstract class ProxyMiddlewareRegistry extends ProxyRegistry<MiddlewareProvider, IMiddlewareOptions> {
    constructor() {
        super(MiddlewareRegistry);
    }
}