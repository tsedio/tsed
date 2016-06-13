require("source-map-support").install();

import {Authenticated as _Authenticated} from "./decorators/authenticated";
import * as Route from "./decorators/route";
import * as _Required from "./decorators/required";
import * as _Params from "./decorators/params";
import {Response as _Response} from "./decorators/response";
import {Request as _Request} from "./decorators/request";
import {Next as _Next} from "./decorators/next";
import {Header as _Header} from "./decorators/header";
import {Use as _Use} from "./decorators/use";
import {Controller as _Controller} from "./decorators/controller";

/**
 * Class decorator
 * @param endpointUrl
 * @param ctlrDepedencies
 * @returns {function(Function): void}
 * @constructor
 */
export function Controller(endpointUrl: string, ...ctlrDepedencies: string[]): Function {
    return _Controller(endpointUrl, ...ctlrDepedencies);
}

/**
 * Method decorator.
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
    return _Authenticated();
}
/**
 *
 * @returns {any}
 * @constructor
 */
export function Required() {
    return _Required.Required();
}
/**
 *
 * @param type
 * @param paramsRequired
 * @returns {any}
 * @constructor
 */
export function ParamsRequired(type: string, ...paramsRequired): Function {
    return _Required.ParamsRequired(type, ...paramsRequired);
}

/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function PathParamsRequired(...paramsRequired): Function {
    return _Required.PathParamsRequired(...paramsRequired);
}
/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function BodyParamsRequired(...paramsRequired): Function {
    return _Required.BodyParamsRequired(...paramsRequired);
}
/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function CookiesParamsRequired(...paramsRequired): Function {
    return _Required.CookiesParamsRequired(...paramsRequired);
}
/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function QueryParamsRequired(...paramsRequired): Function {
    return _Required.QueryParamsRequired(...paramsRequired);
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
    return _Response();
}

/**
 *
 * @returns {Function}
 * @constructor
 */
export function Request(): Function {
    return _Request();
}

/**
 *
 * @returns {Function}
 * @constructor
 */
export function Next(): Function {
    return _Next();
}

export function Header(expression: string): Function {
    return _Header(expression);
}

/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function All(path: string, ...args: any[]): Function {
    return Route.All(path, ...args);
}

/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Get(path: string, ...args: any[]): Function {
    return Route.Get(path, ...args);
}
/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Post(path: string, ...args: any[]): Function {
    return Route.Post(path, ...args);
}
/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Put(path: string, ...args: any[]): Function {
    return Route.Put(path, ...args);
}

/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Delete(path: string, ...args: any[]): Function {
    return Route.Delete(path, ...args);
}

/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Head(path: string, ...args: any[]): Function {
    return Route.Head(path, ...args);
}

/**
 *
 * @param path
 * @param args
 * @returns {Function}
 * @constructor
 */
export function Patch(path: string, ...args: any[]): Function {
    return Route.Patch(path, ...args);
}