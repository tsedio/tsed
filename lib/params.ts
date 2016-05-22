import {parse} from "./parse";
import {attachInject} from "./injector";
import {BadRequest} from "httpexceptions/lib/badrequest";
import {Use} from "./use";

/**
 *
 * @param expressionList
 * @param scope
 * @returns {string[]}
 */
export function checkParamsRequired(expressionList: string[], scope: any): string[] {
    return expressionList.filter((expression: string) => (
        parse(expression, scope) === undefined
    ));
}

/**
 *
 * @param required
 * @param scope
 * @param next
 */
export function tryParams(required: string[], scope: any, next: Function): void {

    let result = checkParamsRequired(required, scope);

    if (result.length) {
        next(new BadRequest("Parameters required " + result.join(", ") + "."));
    } else {
        next();
    }
}

export function ParamsRequired(attr: string, ...paramsRequired): any {
    return Use(function(request: any, response: any, next: Function): void {

        tryParams(paramsRequired, request[attr], next);

    });
}

/**
 *
 * @param attr
 * @param expression
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Params(attr: string, expression: string): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {
            attachInject(target[propertyKey], parameterIndex, (request) => (parse(expression, request[attr])));
        }

    };
}

/**
 *
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
export function CookiesParamsRequired(...paramsRequired): any {
    return Use(function(request: any, response: any, next: Function): void {

        tryParams(paramsRequired, request.cookies, next);

    });
}

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
            attachInject(target[propertyKey], parameterIndex, (request) => (parse(expression, request.cookies)));
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
            attachInject(target[propertyKey], parameterIndex, (request) => (parse(expression, request.body)));
        }

    };
}

/**
 *
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
export function BodyParamsRequired(...paramsRequired): Function {

    return Use(function(request: any, response: any, next: Function): void {

        tryParams(paramsRequired, request.body, next);

    });
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
            attachInject(target[propertyKey], parameterIndex, (request) => (parse(expression, request.params)));
        }

    };
}

/**
 *
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
export function PathParamsRequired(...paramsRequired): Function {
    return Use(function(request: any, response: any, next: Function): void {

        tryParams(paramsRequired, request.params, next);

    });
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
            attachInject(target[propertyKey], parameterIndex, (request) => (parse(expression, request.query)));
        }

    };
}

/**
 *
 * @param paramsRequired
 * @returns {Function}
 * @constructor
 */
export function QueryParamsRequired(...paramsRequired): any {
    return Use(function(request: any, response: any, next: Function): void {

        tryParams(paramsRequired, request.query, next);

    });
}

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Response(): Function {

   return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

       /* istanbul ignore else */
       if (parameterIndex !== undefined) {
           attachInject(target[propertyKey], parameterIndex, "response");
       }
   };
}


/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Request(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {
            attachInject(target[propertyKey], parameterIndex, "request");
        }
    };
}

/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Next(): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {
            attachInject(target[propertyKey], parameterIndex, "next");
        }
    };
}
