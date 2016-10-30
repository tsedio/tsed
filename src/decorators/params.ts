import {attachInject} from "../metadata/attach-inject";
import {parse} from "../utils/parse";

/**
 *
 * @param expression
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function CookiesParams(expression: string): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {
            attachInject(target, propertyKey, parameterIndex, request => parse(expression, request.cookies), `cookies.${expression}`);
        }

    };
}

/**
 *
 * @param expression
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function BodyParams(expression: string): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {
            attachInject(target, propertyKey, parameterIndex, request => parse(expression, request.body), `body.${expression}`);
        }

    };
}

/**
 *
 * @param expression
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function PathParams(expression: string): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {
            attachInject(target, propertyKey, parameterIndex, request => parse(expression, request.params), `params.${expression}`);
        }

    };
}



/**
 *
 * @param expression
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function QueryParams(expression: string): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {
            attachInject(target, propertyKey, parameterIndex, request => parse(expression, request.query), `query.${expression}`);
        }

    };
}

