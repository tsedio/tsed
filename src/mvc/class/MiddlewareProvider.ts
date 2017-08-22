import {Provider} from "../../di/class/Provider";
/**
 * @module common/mvc
 */
import {IMiddlewareOptions, MiddlewareType} from "../interfaces";
/** */

export class MiddlewareProvider extends Provider<any> implements IMiddlewareOptions {

    constructor(provide: any) {
        super(provide);
    }

    set type(type: any) {
        this._type = typeof type === "string" ? type : MiddlewareType[type];
    }

    get type(): any {
        return MiddlewareType[this._type];
    }
}