import InjectParams from "../metadata/inject-params";
import {PARSE_COOKIES, PARSE_BODY, PARSE_PARAMS, PARSE_QUERY, PARSE_SESSION} from "../constants/metadata-keys";

/**
 *
 * @param expression
 * @param useClass
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function CookiesParams(expression?: string | any, useClass?: any): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

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

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

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

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

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

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

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

export function Session(expression?: string | any, useClass?: any) {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

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

