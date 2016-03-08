
require('source-map-support').install();

import Promise = require('bluebird');
import * as Express from "express";
import * as $log from "log-debug";
import {Authenticated as _Authenticated} from './decorators/authenticated';
import {Controller as _Controller} from './decorators/controller';
import {Use as _Use} from './decorators/use';
import {All as _All} from './decorators/all';
import {Get as _Get} from './decorators/get';
import {Post as _Post} from './decorators/post';
import {Put as _Put} from './decorators/put';
import {Delete as _Delete} from './decorators/delete';
import {Head as _Head} from './decorators/head';
import {Patch as _Patch} from './decorators/patch';
import {PathParams as _PathParams} from './decorators/path-params';
import {PathParamsRequired as _PathParamsRequired} from './decorators/path-params-required';
import {QueryParams as _QueryParams} from './decorators/query-params';
import {QueryParamsRequired as _QueryParamsRequired} from './decorators/query-params-required';
import {BodyParams as _BodyParams} from './decorators/body-params';
import {BodyParamsRequired as _BodyParamsRequired} from './decorators/body-params-required';
import {CookiesParams as _CookiesParams} from './decorators/cookies-params';

/**
 *
 * @param endpointUrl
 * @param ctrls
 * @returns {function(Function): void}
 * @constructor
 */
export function Controller(endpointUrl:string, ...ctrls): any {
    return _Controller(endpointUrl, ...ctrls);
}

/**
 *
 * @param method
 * @param path
 * @returns {Function}
 * @constructor
 */
export function Use(method: string | Function, path?: string): Function {
    return _Use(method, path);
}
/**
 * Method decorator
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Authenticated(targetClass: any, methodClassName: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
    return _Authenticated(targetClass, methodClassName, descriptor);
}

/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function PathParamsRequired(...paramsRequired): Function {
    return _PathParamsRequired(...paramsRequired);
}
/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function BodyParamsRequired(...paramsRequired): Function {
    return _BodyParamsRequired(...paramsRequired);
}

/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function QueryParamsRequired(...paramsRequired): Function {
    return _QueryParamsRequired(...paramsRequired);
}

/**
 *
 * @param expression
 * @returns {Function}
 * @constructor
 */
export function QueryParams(expression?:string): Function {
    return _QueryParams(expression);
}

/**
 *
 * @param expression
 * @returns {Function}
 * @constructor
 */
export function PathParams(expression?:string): Function {
    return _PathParams(expression);
}
/**
 *
 * @param expression
 * @returns {Function}
 * @constructor
 */
export function CookiesParams(expression?:string): Function {
    return _CookiesParams(expression);
}

/**
 *
 * @param expression
 * @returns {Function}
 * @constructor
 */
export function BodyParams(expression?:string): Function {
    return _BodyParams(expression);
}
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function All(path: string): Function {
    return _All(path);
}
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Get(path: string): Function {
    return _Get(path);
}
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Post(path: string): Function {
    return _Post(path);
}
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Put(path: string): Function {
    return _Put(path);
}
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Delete(path: string): Function {
    return _Delete(path);
}

/**
 *
 * @param path
 * @returns {Function}
 * @constructor
 */
export function Head(path: string): Function {
    return _Head(path);
}

/**
 *
 * @param path
 * @returns {any}
 * @constructor
 */
export function Patch(path: string): Function {
    return _Patch(path);
}