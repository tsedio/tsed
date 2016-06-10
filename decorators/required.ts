import {Use} from "./use";
import {tryParams} from "../lib/try-params";
import * as Express from "express";
import {attachRequired} from "./../lib/attach-required";

/**
 *
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
 *
 * @param attr
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
export function ParamsRequired(attr: string, ...paramsRequired: string[]): any {
    return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        tryParams(paramsRequired, request[attr], next);

    });
}
/**
 *
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
export function PathParamsRequired(...paramsRequired: string[]): Function {
    return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        tryParams(paramsRequired, request.params, next);

    });
}
/**
 *
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
export function QueryParamsRequired(...paramsRequired: string[]): any {
    return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        tryParams(paramsRequired, request.query, next);

    });
}

/**
 *
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
export function CookiesParamsRequired(...paramsRequired: string[]): any {
    return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        tryParams(paramsRequired, request.cookies, next);

    });
}


/**
 *
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
export function BodyParamsRequired(...paramsRequired: string[]): Function {

    return Use(function(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        tryParams(paramsRequired, request.body, next);

    });
}