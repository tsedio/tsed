import {Use} from "./use";
import {tryParams} from "../lib/try-params";
import * as Express from "express";
import {attachRequired} from "./../lib/attach-required";

/**
 * Add required annotation for a function argument .
 * @returns {Function}
 * @constructor
 */
export function Required(): any {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {
            attachRequired(target[propertyKey], parameterIndex);
        }

    };

}

/**
 * @deprecated
 * @param attr
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
/* istanbul ignore next */
export const ParamsRequired = require('util').deprecate(function(attr: string, ...paramsRequired: string[]): any {

    return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        tryParams(paramsRequired, request[attr], next);

    });
}, '@ParamsRequired: use @Required instead');

/**
 * @deprecated
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
/* istanbul ignore next */
export const PathParamsRequired = require('util').deprecate(function(...paramsRequired: string[]): Function {
    return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        tryParams(paramsRequired, request.params, next);

    });
}, '@PathParamsRequired: use @Required instead');

/**
 * @deprecated
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
/* istanbul ignore next */
export const QueryParamsRequired = require('util').deprecate(function(...paramsRequired: string[]): any {
    return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        tryParams(paramsRequired, request.query, next);

    });
}, '@QueryParamsRequired: use @Required instead');

/**
 * @deprecated
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
/* istanbul ignore next */
export const CookiesParamsRequired = require('util').deprecate(function(...paramsRequired: string[]): any {
    return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        tryParams(paramsRequired, request.cookies, next);

    });
}, '@CookiesParamsRequired: use @Required instead');


/**
 * @deprecated
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
/* istanbul ignore next */
export const BodyParamsRequired = require('util').deprecate(function(...paramsRequired: string[]): Function {

    return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        tryParams(paramsRequired, request.body, next);

    });
}, '@BodyParamsRequired: use @Required instead');