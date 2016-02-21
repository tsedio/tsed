
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
import {PathParamsRequired as _PathParamsRequired} from './decorators/path-params-required';
import {QueryParamsRequired as _QueryParamsRequired} from './decorators/query-params-required';
import {BodyParamsRequired as _BodyParamsRequired} from './decorators/body-params-required';
/**
 * Class decorator
 * @param endpointUrl
 * @returns {function(Function): undefined}
 * @constructor
 */
export function Controller(endpointUrl:string, ...ctrls){
    return _Controller.apply(this, arguments);
}

/**
 * Method decorator
 * @param method
 * @param path
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Use(method, path?){
    return _Use.apply(this, arguments);
}
/**
 * Method decorator
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Authenticated(targetClass, methodClassName, descriptor){
    return _Authenticated.apply(this, arguments);
}

/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function PathParamsRequired(...paramsRequired){
    return _PathParamsRequired.apply(this, arguments);
}
/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function BodyParamsRequired(...paramsRequired){
    return _BodyParamsRequired.apply(this, arguments);
}
/**
 *
 * @param paramsRequired
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function QueryParamsRequired(...paramsRequired){
    return _QueryParamsRequired.apply(this, arguments);
}
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function All(path:string, ...args){
    return _All.apply(this, arguments);
}
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Get(path:string, ...args){
    return _Get.apply(this, arguments);}
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Post(path:string, ...args){
    return _Post.apply(this, arguments);
}
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Put(path:string, ...args){
    return _Put.apply(this, arguments);
}
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Delete(path:string, ...args){
    return _Delete.apply(this, arguments);
}
/**
 *
 * @param path
 * @param args
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Head(path:string, ...args){
    return _Head.apply(this, arguments);
}