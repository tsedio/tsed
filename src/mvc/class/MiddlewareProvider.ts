/**
 * @module mvc
 */
import {IMiddlewareOptions} from "../interfaces/MiddlewareOptions";
import {MiddlewareType} from "../interfaces/Middleware";
import {Provider} from "../../di/class/Provider";
/** */

export class MiddlewareProvider extends Provider<any> implements IMiddlewareOptions {

    constructor(provide) {
        super(provide);
    }

    set type(type: any) {
        this._type = typeof type === "string" ? type : MiddlewareType[type];
    }

    get type(): any {
        return MiddlewareType[this._type];
    }
}