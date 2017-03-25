import InjectParams from "../services/inject-params";
import {
    PARSE_COOKIES, PARSE_BODY, PARSE_PARAMS, PARSE_QUERY, PARSE_SESSION, GET_HEADER, PARSE_LOCALS
} from "../constants/metadata-keys";

/**
 *
 * @param expression
 * @param useClass
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function CookiesParams(expression?: string | any, useClass?: any): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            InjectParams.build(PARSE_COOKIES, {
                propertyKey,
                parameterIndex,
                expression,
                target,
                useClass
            });

        }

    };
}

/**
 *
 * @param expression
 * @param useClass
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function BodyParams(expression?: string | any, useClass?: any): Function {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            InjectParams.build(PARSE_BODY, {
                propertyKey,
                parameterIndex,
                expression,
                target,
                useClass
            });
        }

    };
}

/**
 *
 * @param expression
 * @param useClass
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function PathParams(expression?: string | any, useClass?: any): Function {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            InjectParams.build(PARSE_PARAMS, {
                propertyKey,
                parameterIndex,
                expression,
                target,
                useClass
            });

        }

    };
}

/**
 *
 * @param expression
 * @param useClass
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function QueryParams(expression?: string | any, useClass?: any): Function {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            InjectParams.build(PARSE_QUERY, {
                propertyKey,
                parameterIndex,
                expression,
                target,
                useClass
            });

        }

    };
}

/**
 *
 * @param expression
 * @param useClass
 * @returns {(target:any, propertyKey:(string|symbol), parameterIndex:number)=>void}
 * @constructor
 */
export function Session(expression?: string | any, useClass?: any) {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            InjectParams.build(PARSE_SESSION, {
                propertyKey,
                parameterIndex,
                expression,
                target,
                useClass
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
export function HeaderParams(expression) {
    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.service = GET_HEADER;
            injectParams.expression = expression;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);

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

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            InjectParams.build(PARSE_LOCALS, {
                propertyKey,
                parameterIndex,
                expression,
                target,
                useConverter: false
            });

        }

    };
}