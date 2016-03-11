
require("source-map-support").install();

import {Controller as _Controller} from "./lib/controller";
import {Use as _Use} from "./lib/use";
import * as _Params from "./lib/params";
import {Forbidden} from "httpexceptions";

/**
 *
 * @param endpointUrl
 * @param ctrls
 * @returns {function(Function): void}
 * @constructor
 */
export function Controller(endpointUrl: string, ...ctrls): any {
    return _Controller(endpointUrl, ...ctrls);
}

/**
 *
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Use(...args): Function {
    return _Use(...args);
}

/**
 * Method decorator
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Authenticated(): Function {
    return _Use(function(request: any, response: any, next: Function) {

        if (request.isAuthenticated()) {
            return next();
        }

        next(new Forbidden("Forbidden"));

    });
}

/**
 *
 * @param type
 * @param paramsRequired
 * @returns {any}
 * @constructor
 */
export function ParamsRequired(type: string, ...paramsRequired): Function {
    return _Params.ParamsRequired(type, ...paramsRequired);
}

/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function PathParamsRequired(...paramsRequired): Function {
    return _Params.PathParamsRequired(...paramsRequired);
}
/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function BodyParamsRequired(...paramsRequired): Function {
    return _Params.BodyParamsRequired(...paramsRequired);
}
/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function CookiesParamsRequired(...paramsRequired): Function {
    return _Params.CookiesParamsRequired(...paramsRequired);
}
/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function QueryParamsRequired(...paramsRequired): Function {
    return _Params.QueryParamsRequired(...paramsRequired);
}

/**
 *
 * @param type
 * @param expression
 * @returns {Function}
 * @constructor
 */
export function Params(type: string, expression?: string): Function {
    return _Params.Params(type, expression);
}

/**
 *
 * @param expression
 * @returns {Function}
 * @constructor
 */
export function QueryParams(expression?: string): Function {
    return _Params.QueryParams(expression);
}

/**
 *
 * @param expression
 * @returns {Function}
 * @constructor
 */
export function PathParams(expression?: string): Function {
    return _Params.PathParams(expression);
}
/**
 *
 * @param expression
 * @returns {Function}
 * @constructor
 */
export function CookiesParams(expression?: string): Function {
    return _Params.CookiesParams(expression);
}

/**
 *
 * @param expression
 * @returns {Function}
 * @constructor
 */
export function BodyParams(expression?: string): Function {
    return _Params.BodyParams(expression);
}

/**
 *
 * @returns {Function}
 * @constructor
 */
export function Response(): Function {
    return _Params.Response();
}

/**
 *
 * @returns {Function}
 * @constructor
 */
export function Request(): Function {
    return _Params.Request();
}

/**
 *
 * @returns {Function}
 * @constructor
 */
export function Next(): Function {
    return _Params.Next();
}

/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function All(path: string, ...args: any[]): Function {
    return Use(...["all", path].concat(args));
}

/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Get(path: string, ...args: any[]): Function {
    return Use(...["get", path].concat(args));
}
/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Post(path: string, ...args: any[]): Function {
    return Use(...["post", path].concat(args));
}
/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Put(path: string, ...args: any[]): Function {
    return Use(...["put", path].concat(args));
}

/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Delete(path: string, ...args: any[]): Function {
    return Use(...["delete", path].concat(args));
}

/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Head(path: string, ...args: any[]): Function {
    return Use(...["head", path].concat(args));
}

/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Patch(path: string, ...args: any[]): Function {
    return Use(...["patch", path].concat(args));
}