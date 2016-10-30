import {Use} from "./use";
import * as Express from "express";
import {tryParams} from "../utils/try-params";
import Metadata from '../metadata/metadata';
import {PARAMS_REQUIRED} from '../constants/metadata-keys';

/**
 * Add required annotation for a function argument .
 * @returns {Function}
 */
export function Required(): any {

    return (target: Function, targetKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

            const requiredParams = Metadata.has(PARAMS_REQUIRED, target, targetKey)
                ? Metadata.get(PARAMS_REQUIRED, target, targetKey) : [];

            requiredParams[parameterIndex] = true;

            Metadata.set(PARAMS_REQUIRED, requiredParams, target, targetKey);

        }

    };

}

// /**
//  * @deprecated
//  * @param attr
//  * @param paramsRequired
//  * @returns {Function}
//  * @constructor
//  */
// /* istanbul ignore next */
// export const ParamsRequired = require('util').deprecate(function(attr: string, ...paramsRequired: string[]): any {
//
//     return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
//
//         tryParams(paramsRequired, request[attr], next);
//
//     });
// }, '@ParamsRequired: use @Required instead');
//
// /**
//  * @deprecated
//  * @param paramsRequired
//  * @returns {Function}
//  * @constructor
//  */
// /* istanbul ignore next */
// export const PathParamsRequired = require('util').deprecate(function(...paramsRequired: string[]): Function {
//     return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
//
//         tryParams(paramsRequired, request.params, next);
//
//     });
// }, '@PathParamsRequired: use @Required instead');
//
// /**
//  * @deprecated
//  * @param paramsRequired
//  * @returns {Function}
//  * @constructor
//  */
// /* istanbul ignore next */
// export const QueryParamsRequired = require('util').deprecate(function(...paramsRequired: string[]): any {
//     return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
//
//         tryParams(paramsRequired, request.query, next);
//
//     });
// }, '@QueryParamsRequired: use @Required instead');
//
// /**
//  * @deprecated
//  * @param paramsRequired
//  * @returns {Function}
//  * @constructor
//  */
// /* istanbul ignore next */
// export const CookiesParamsRequired = require('util').deprecate(function(...paramsRequired: string[]): any {
//     return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
//
//         tryParams(paramsRequired, request.cookies, next);
//
//     });
// }, '@CookiesParamsRequired: use @Required instead');
//
//
// /**
//  * @deprecated
//  * @param paramsRequired
//  * @returns {Function}
//  * @constructor
//  */
// /* istanbul ignore next */
// export const BodyParamsRequired = require('util').deprecate(function(...paramsRequired: string[]): Function {
//
//     return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
//
//         tryParams(paramsRequired, request.body, next);
//
//     });
// }, '@BodyParamsRequired: use @Required instead');