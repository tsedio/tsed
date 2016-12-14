import InjectParams from "../metadata/inject-params";
import {PARSE_COOKIES, PARSE_BODY, PARSE_PARAMS, PARSE_QUERY, DESIGN_PARAM_TYPES} from "../constants/metadata-keys";
import Metadata from '../metadata/metadata';

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

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.service = PARSE_COOKIES;
            injectParams.expression = expression;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);
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
export function BodyParams(expression: string, useClass?: any): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.service = PARSE_BODY;
            injectParams.expression = expression;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);

            if(useClass){
                const paramsTypes = Metadata.get(DESIGN_PARAM_TYPES, target, propertyKey) || [];
                paramsTypes[parameterIndex] = useClass;

                Metadata.set(DESIGN_PARAM_TYPES, paramsTypes, target, propertyKey);
            }
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

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.service = PARSE_PARAMS;
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
export function QueryParams(expression: string): Function {

    return (target: Function, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

            const injectParams = InjectParams.get(target, propertyKey, parameterIndex);

            injectParams.service = PARSE_QUERY;
            injectParams.expression = expression;

            InjectParams.set(target, propertyKey, parameterIndex, injectParams);
        }

    };
}

