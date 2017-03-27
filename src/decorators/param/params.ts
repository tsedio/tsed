import {CookiesParamsFilter} from "../../filters/cookies-params";
import {BodyParamsFilter} from "../../filters/body-params";
import {PathParamsFilter} from "../../filters/path-params";
import {QueryParamsFilter} from "../../filters/query-params";
import {HeaderFilter} from "../../filters/header";
import {LocalsFilter} from "../../filters/locals";
import {SessionFilter} from "../../filters/session";
import EndpointParam from "../../controllers/endpoint-param";
import {Type} from "../../interfaces/interfaces";

/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function CookiesParams(expression?: string | any, useType?: any): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(CookiesParamsFilter,  {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}

/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function BodyParams(expression?: string | any, useType?: any): Function {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(BodyParamsFilter,  {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}

/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function PathParams(expression?: string | any, useType?: any): Function {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(PathParamsFilter,  {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}

/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function QueryParams(expression?: string | any, useType?: any): Function {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(QueryParamsFilter,  {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}

/**
 *
 * @param expression
 * @param useType
 * @returns {(target:any, propertyKey:(string|symbol), parameterIndex:number)=>void}
 * @constructor
 */
export function Session(expression?: string | any, useType?: any) {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(SessionFilter,  {
                target,
                propertyKey,
                parameterIndex,
                expression
            });

        }

    };
}

/**
 *
 * @param expression
 * @returns {(target:any, propertyKey:(string|symbol), parameterIndex:number)=>void}
 * @constructor
 */
export function HeaderParams(expression: string) {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(HeaderFilter,  {
                target,
                propertyKey,
                parameterIndex,
                expression
            });

        }

    };
}

/**
 *
 * @param expression
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Locals(expression?: string | any): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(LocalsFilter,  {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useConverter: false
            });

        }

    };
}